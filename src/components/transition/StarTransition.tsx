import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_DURATION = 750
const FADE_OUT_START = 600
const TIME_SCALE = 5.5

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

/* ------------------------------------------------------------------ */
/*  GLSL sources                                                       */
/* ------------------------------------------------------------------ */

const VERT = /* glsl */ `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision mediump float;

uniform float iTime;
uniform vec2  iResolution;

#define PI 3.14159

float star(vec2 p, float radius, float inset, float n){
  float teta = 2.0 * PI / n;
  mat2x2 rot1 = mat2x2(cos(teta), sin(teta), -sin(teta), cos(teta));

  vec2 p1 = vec2(0.0, radius);
  vec2 p2 = vec2(sin(teta*0.5), cos(teta*0.5))*radius*inset;

  float tetaP = PI + atan(-p.x, -p.y);
  tetaP = mod(tetaP + PI / n, 2.0 * PI);

  for(float i = teta; i < tetaP; i += teta)
    p = rot1 * p;

  p.x = abs(p.x);

  vec2 ba = p2 - p1;
  vec2 pa = p - p1;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float d = length(pa - h * ba);
  d *= sign(dot(p - p1, -vec2(ba.y, -ba.x)));
  return d;
}

float starPattern(vec2 p, int starCount, float speed) {
  float colSum = 0.;
  float outerShape = 1. - smoothstep(-.01, -.001, star(p, 1., .6, 5.));

  for (int i = 0; i < starCount * 2; i += 1) {
    float delta = float(i) - (2. * fract(iTime * speed) - 1.);
    float radius = 1. - delta / float(starCount * 2);
    float s = 1. - smoothstep(-.01, -.001, star(p, radius, .6, 5.));
    colSum = i % 2 == 0 ? colSum + s : colSum - s;
  }

  float innerStarDelta = 2. * fract(iTime * speed) - 1.;
  float innerStarRadius = innerStarDelta / float(starCount * 2);
  if (innerStarRadius > 0.) {
    float innerStar = 1. - smoothstep(-.01, -.001, star(p, innerStarRadius, .6, 5.));
    colSum += innerStar;
  }

  colSum *= outerShape;
  return colSum;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord / iResolution.xy * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;
  uv.y += .1;

  float starCol = starPattern(uv, 4, .25);

  vec3 black = vec3(0.039, 0.039, 0.039);
  vec3 red   = vec3(0.902, 0.0, 0.047);
  vec3 white = vec3(0.961, 0.961, 0.941);

  vec3 color = mix(black, red,   smoothstep(0.0,  0.35, starCol));
  color      = mix(color, white, smoothstep(0.35, 0.75, starCol));

  gl_FragColor = vec4(color, 1.0);
}
`

/* ------------------------------------------------------------------ */
/*  WebGL helpers                                                      */
/* ------------------------------------------------------------------ */

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function buildProgram(
  gl: WebGLRenderingContext,
): { program: WebGLProgram; iTime: WebGLUniformLocation; iResolution: WebGLUniformLocation } | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vert || !frag) return null

  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  gl.deleteShader(vert)
  gl.deleteShader(frag)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  const iTime = gl.getUniformLocation(program, 'iTime')
  const iResolution = gl.getUniformLocation(program, 'iResolution')
  if (!iTime || !iResolution) {
    gl.deleteProgram(program)
    return null
  }

  return { program, iTime, iResolution }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface StarTransitionProps {
  active: boolean
  generation: number
  onComplete: () => void
}

export function StarTransition({
  active,
  generation,
  onComplete,
}: StarTransitionProps) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* WebGL state — created once, reused across transitions */
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const iTimeRef = useRef<WebGLUniformLocation | null>(null)
  const iResolutionRef = useRef<WebGLUniformLocation | null>(null)

  /* Animation state */
  const startTimeRef = useRef(0)
  const activeRef = useRef(false)
  const rafRef = useRef(0)
  const genOnStartRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  const renderFrameRef = useRef(() => {})
  const [opacity, setOpacity] = useState(0)

  onCompleteRef.current = onComplete

  /* ---------------------------------------------------------------- */
  /*  1. Canvas sizing                                                  */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  /* ---------------------------------------------------------------- */
  /*  2. WebGL init (once)                                              */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) return

    const result = buildProgram(gl)
    if (!result) return

    gl.useProgram(result.program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)

    const pos = gl.getAttribLocation(result.program, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    glRef.current = gl
    programRef.current = result.program
    iTimeRef.current = result.iTime
    iResolutionRef.current = result.iResolution

    return () => {
      gl.deleteProgram(result.program)
      gl.deleteBuffer(buffer)
      glRef.current = null
      programRef.current = null
    }
  }, [])

  /* ---------------------------------------------------------------- */
  /*  3. Render loop                                                    */
  /* ---------------------------------------------------------------- */

  renderFrameRef.current = () => {
    if (!activeRef.current) return

    const gl = glRef.current
    const iTime = iTimeRef.current
    const iResolution = iResolutionRef.current
    const canvas = canvasRef.current
    if (!gl || !iTime || !iResolution || !canvas) return

    const elapsed = performance.now() - startTimeRef.current

    /* If tab was hidden and came back, snap to end */
    if (elapsed > TOTAL_DURATION + 200) {
      activeRef.current = false
      onCompleteRef.current()
      return
    }

    const t = Math.min(elapsed / 1000, TOTAL_DURATION / 1000) * TIME_SCALE

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform1f(iTime, t)
    gl.uniform2f(iResolution, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    if (elapsed >= TOTAL_DURATION) {
      activeRef.current = false
      /* Only fire callback if this generation is still current */
      if (genOnStartRef.current === generation) {
        onCompleteRef.current()
      }
      return
    }

    rafRef.current = requestAnimationFrame(renderFrameRef.current)
  }

  /* ---------------------------------------------------------------- */
  /*  4. Activation                                                     */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (reduced) return

    if (!active) {
      activeRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setOpacity(0)
      return
    }

    startTimeRef.current = performance.now()
    genOnStartRef.current = generation
    activeRef.current = true
    setOpacity(1)
    rafRef.current = requestAnimationFrame(renderFrameRef.current)

    return () => {
      activeRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, generation, reduced])

  /* ---------------------------------------------------------------- */
  /*  5. CSS fade-out                                                   */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!active || reduced) return

    const fadeTimer = setTimeout(() => setOpacity(0), FADE_OUT_START)
    return () => clearTimeout(fadeTimer)
  }, [active, reduced])

  /* ---------------------------------------------------------------- */
  /*  6. Reduced motion: skip entirely                                  */
  /* ---------------------------------------------------------------- */

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95]"
      style={{
        opacity,
        transition: 'opacity 150ms ease-out',
      }}
    />
  )
}
