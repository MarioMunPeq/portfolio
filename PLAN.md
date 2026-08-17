# WebGL Star Shader Transition — Implementation Plan

## Overview

Add a `StarTransition` component that renders a fullscreen WebGL canvas with an abstract star-burst shader. The canvas plays as an **additional overlay** for inter-menu route transitions only (between the four menu pages: `/about`, `/projects`, `/experience`, `/education`). The existing Sweep continues to fire for all transitions — the opaque star canvas simply hides it during inter-menu switches.

---

## Files

| Action | File | Lines (est.) |
|--------|------|-------------|
| **Create** | `src/components/transition/StarTransition.tsx` | ~190 |
| **Modify** | `src/components/transition/AnimatedRoutes.tsx` | +30 lines |

No other files touched.

---

## 1. `StarTransition.tsx` — Full Component Design

### 1.1 Public Interface

```ts
interface StarTransitionProps {
  active: boolean        // true while the star transition should be visible
  onComplete: () => void // called when the 750ms cycle finishes
}
```

The component renders a `<canvas>` and manages its own WebGL context, shader program, uniforms, and animation loop entirely internally.

### 1.2 Constants (module-level, not exported)

```ts
const MENU_PATHS = new Set(['/about', '/projects', '/experience', '/education'])

const TOTAL_DURATION = 750   // ms: 600 shader + 150 fade-out
const FADE_OUT_START = 600   // ms into the cycle when CSS opacity begins fading
const TIME_SCALE = 5.5       // compresses the 4s shader cycle into ~600ms
const BG_COLOR = [0.039, 0.039, 0.039] // #0A0A0A
```

### 1.3 GLSL — Vertex Shader (trivial fullscreen quad)

```glsl
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
```

A single triangle-strip covering the clip-space quad `(-1,-1) → (1,1)`. Four vertices, two triangles. No VAO needed — just `gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)`.

Vertex buffer data (created once):

```ts
const QUAD = new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
   1,  1,
])
```

### 1.4 GLSL — Fragment Shader (recolored)

```glsl
precision mediump float;

uniform float iTime;
uniform vec2  iResolution;

// --- star function (port verbatim) ---
float star(vec2 p, float radius, float inset, float n) {
    // ... exact copy from spec ...
}

// --- starPattern (port verbatim) ---
float starPattern(vec2 p, int starCount, float speed) {
    // ... exact copy from spec ...
}

void main() Le he p
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / iResolution.xy * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.y += 0.1;

    float starCol = starPattern(uv, 4, 0.25);

    // --- RECOLOR ---
    // starCol ≈ 0 → near-black
    // starCol medium → accent red
    // starCol highest → paper white

    vec3 black = vec3(0.039);
    vec3 red   = vec3(0.902, 0.0, 0.047);
    vec3 white = vec3(0.961, 0.961, 0.941);

    vec3 color = mix(black, red,   smoothstep(0.0, 0.35, starCol));
    color      = mix(color, white, smoothstep(0.35, 0.75, starCol));

    gl_FragColor = vec4(color, 1.0);
}
```

**Key difference from spec:** The `iTime` variable used in `starPattern` is a `uniform float iTime` declared in the fragment shader. The original spec references it via `iTime` (Shadertoy convention). We declare it as a uniform and pass the elapsed time (scaled) from JS.

**`iResolution`** is also a uniform — set to `[canvas.width, canvas.height, 1.0]` once on resize / init.

### 1.5 WebGL Setup (runs once in a `useEffect` on mount)

Sequence:

1. **Guard:** If `!canvasRef.current`, bail.
2. **Get context:** `canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: false })`. Store in `glRef`.
3. **Compile shaders:** Helper `compileShader(type, source)` returns `WebGLShader`. Link vertex + fragment into a `WebGLProgram`. Store in `programRef`.
4. **Cache uniform locations:** `gl.getUniformLocation(program, 'iTime')` and `gl.getUniformLocation(program, 'iResolution')`. Store in `uniformsRef`.
5. **Create vertex buffer:** `gl.createBuffer()`, bind to `ARRAY_BUFFER`, upload `QUAD` data. Store in `bufferRef`.
6. **Set up attribute:** `gl.getAttribLocation(program, 'a_position')`. Enable, pointer, float. Store in `attribRef`.
7. **Store `gl.useProgram(program)`** — called once, stays active.
8. **Return cleanup:** delete program, buffers, shader objects.

### 1.6 Render Loop

Managed by a `requestAnimationFrame` loop stored in `rafRef`. Only runs when `activeRef.current === true`.

```ts
function renderFrame() {
  if (!activeRef.current || !glRef.current) return

  const gl = glRef.current
  const elapsed = performance.now() - startTimeRef.current
  const t = (elapsed / 1000) * TIME_SCALE  // compressed time in seconds

  // Update uniforms
  gl.uniform1f(uniformsRef.current.iTime, t)
  gl.uniform2f(uniformsRef.current.iResolution, canvasRef.current!.width, canvasRef.current!.height)

  // Draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  // Check if cycle complete
  if (elapsed >= TOTAL_DURATION) {
    activeRef.current = false
    onCompleteRef.current()
    return
  }

  rafRef.current = requestAnimationFrame(renderFrame)
}
```

All mutable state (`glRef`, `programRef`, `uniformsRef`, `bufferRef`, `attribRef`, `startTimeRef`, `activeRef`, `rafRef`, `onCompleteRef`) stored in `useRef` — no re-renders triggered by the animation loop.

### 1.7 Activation Logic (triggered by `active` prop change)

A `useEffect` watches `active`:

```ts
useEffect(() => {
  if (!active) {
    // Ensure loop stops if deactivated mid-cycle
    activeRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    return
  }

  // Start the cycle
  startTimeRef.current = performance.now()
  activeRef.current = true
  rafRef.current = requestAnimationFrame(renderFrame)
}, [active])
```

`onComplete` ref is updated on every render so the callback is always fresh:

```ts
useEffect(() => {
  onCompleteRef.current = onComplete
}, [onComplete])
```

### 1.8 CSS Fade-Out

The `<canvas>` uses inline `style={{ opacity }}` driven by a simple `useState<number>` that transitions from `1 → 0` during the last 150ms.

Implementation via a second `useEffect` that fires when `active` becomes `true`:

```ts
useEffect(() => {
  if (!active) {
    setOpacity(1)  // reset for next cycle
    return
  }
  const fadeTimer = setTimeout(() => setOpacity(0), FADE_OUT_START)
  const hideTimer = setTimeout(() => {
    // Canvas fully hidden; safe for next transition
  }, TOTAL_DURATION)
  return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
}, [active])
```

The canvas element:

```tsx
<canvas
  ref={canvasRef}
  aria-hidden="true"
  className="fixed inset-0 z-[95]"
  style={{
    opacity,
    transition: 'opacity 150ms ease-out',
    background: '#0A0A0A',
  }}
/>
```

### 1.9 Canvas Sizing

Set `width` and `height` attributes (not CSS) to match `window.innerWidth` and `window.innerHeight` on mount and on `resize`. Use a single `ResizeObserver` on the canvas element (or just `window.addEventListener('resize', ...)`). No `devicePixelRatio` scaling — the shader is abstract.

```ts
useEffect(() => {
  function resize() {
    if (!canvasRef.current) return
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)
  return () => window.removeEventListener('resize', resize)
}, [])
```

### 1.10 Lifecycle Summary

```
Mount
  → Create canvas ref
  → Init WebGL (useEffect [])
  → Set up resize listener

active = true
  → Start rAF loop at t=0
  → At 600ms: begin CSS fade-out (opacity 1→0 over 150ms)
  → At 750ms: stop rAF, call onComplete()

active = false
  → Cancel rAF, reset opacity to 1
```

### 1.11 Full `useRef` Map

| Ref | Type | Purpose |
|-----|------|---------|
| `canvasRef` | `HTMLCanvasElement \| null` | DOM element |
| `glRef` | `WebGLRenderingContext \| null` | WebGL context |
| `programRef` | `WebGLProgram \| null` | Linked shader program |
| `uniformsRef` | `{ iTime: WebGLUniformLocation, iResolution: WebGLUniformLocation }` | Uniform locations |
| `bufferRef` | `WebGLBuffer \| null` | Quad vertex buffer |
| `attribRef` | `number` | Attribute location |
| `startTimeRef` | `number` | `performance.now()` at cycle start |
| `activeRef` | `boolean` | Whether loop is running |
| `rafRef` | `number \| null` | `requestAnimationFrame` ID |
| `onCompleteRef` | `() => void` | Latest `onComplete` callback |

---

## 2. `AnimatedRoutes.tsx` — Changes

### 2.1 New Imports

```ts
import { StarTransition } from './StarTransition'
```

No other imports needed — `MENU_PATHS` lives inside `StarTransition.tsx` and is not exported (AnimatedRoutes defines its own local set for detection).

### 2.2 New Constants

```ts
const MENU_PATHS = new Set(['/about', '/projects', '/experience', '/education'])
```

Duplicated in both files. `AnimatedRoutes` needs it for detection logic. `StarTransition` has it internally for its own reference (but doesn't actually need it — it's purely driven by `active` prop). We define it only in `AnimatedRoutes` and export nothing from `StarTransition` except the component. `StarTransition` doesn't need the set at all since it's purely prop-driven.

**Revised:** Define `MENU_PATHS` only in `AnimatedRoutes.tsx`. `StarTransition` is a dumb overlay — it plays when told to.

### 2.3 New State

```ts
const [starActive, setStarActive] = useState(false)
```

### 2.4 Detection Logic in `useEffect`

Inside the existing `useEffect` that watches `location.pathname`, **after the `prevPath.current = location.pathname` line**, add:

```ts
const isInterMenu =
  MENU_PATHS.has(prevPath.current) && MENU_PATHS.has(location.pathname)
```

Wait — `prevPath.current` is updated *before* this check on line 34. We need to capture it first:

```ts
useEffect(() => {
  if (prevPath.current === location.pathname) return
  const from = prevPath.current
  prevPath.current = location.pathname

  if (reduced) {
    progress.set(0)
    return
  }

  // Inter-menu detection
  const isInterMenu = MENU_PATHS.has(from) && MENU_PATHS.has(location.pathname)
  if (isInterMenu) {
    setStarActive(true)
  }

  const cover = animate(progress, 1, { duration: 0.42, ease: EASE })
  const revealTimer = setTimeout(() => {
    animate(progress, 0, { duration: 0.55, ease: EASE })
  }, 470)
  return () => {
    cover.stop()
    clearTimeout(revealTimer)
  }
}, [location.pathname, progress, reduced])
```

**Important:** The `prevPath.current` ref is updated *after* capturing `from` but *before* the `reduced` early return. This is safe because the `reduced` path doesn't reference `from`.

Actually, looking at the existing code more carefully: the early return on line 34 (`if (prevPath.current === location.pathname) return`) runs *before* the assignment. The assignment `prevPath.current = location.pathname` happens on line 34 in the original. We need to restructure slightly:

```ts
useEffect(() => {
  if (prevPath.current === location.pathname) return
  const from = prevPath.current       // capture BEFORE update
  prevPath.current = location.pathname // update

  if (reduced) {
    progress.set(0)
    return
  }

  const isInterMenu = MENU_PATHS.has(from) && MENU_PATHS.has(location.pathname)
  if (isInterMenu) {
    setStarActive(true)
  }

  const cover = animate(progress, 1, { duration: 0.42, ease: EASE })
  const revealTimer = setTimeout(() => {
    animate(progress, 0, { duration: 0.55, ease: EASE })
  }, 470)
  return () => {
    cover.stop()
    clearTimeout(revealTimer)
  }
}, [location.pathname, progress, reduced])
```

### 2.5 StarTransition `onComplete` Handler

```ts
const handleStarComplete = useCallback(() => {
  setStarActive(false)
}, [])
```

Import `useCallback` alongside `useEffect, useRef`.

### 2.6 Render Changes

```tsx
if (reduced) {
  return <>{routes}</>
}

return (
  <>
    <AnimatePresence mode="wait" initial={false}>
      {routes}
    </AnimatePresence>
    <Sweep progress={progress} />
    <StarTransition active={starActive} onComplete={handleStarComplete} />
  </>
)
```

The `StarTransition` is **always mounted** (after the `reduced` guard). It just sits invisible (`opacity: 1` but no rAF loop) until `active` goes `true`.

### 2.7 Full Modified `AnimatedRoutes.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import {
  AnimatePresence,
  animate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'
import { Sweep } from '../primitives/Sweep'
import { StarTransition } from './StarTransition'
import { Home } from '../../pages/Home'
import { About } from '../../pages/About'
import { Projects } from '../../pages/Projects'
import { Experience } from '../../pages/Experience'
import { Education } from '../../pages/Education'
import { ProjectDetail } from '../../pages/ProjectDetail'
import { NotFound } from '../../pages/NotFound'

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const MENU_PATHS = new Set(['/about', '/projects', '/experience', '/education'])

export function AnimatedRoutes() {
  const location = useLocation()
  const reduced = useReducedMotion()
  const progress = useMotionValue(0)
  const prevPath = useRef(location.pathname)
  const [starActive, setStarActive] = useState(false)

  const handleStarComplete = useCallback(() => {
    setStarActive(false)
  }, [])

  useEffect(() => {
    if (prevPath.current === location.pathname) return
    const from = prevPath.current
    prevPath.current = location.pathname
    if (reduced) {
      progress.set(0)
      return
    }
    if (MENU_PATHS.has(from) && MENU_PATHS.has(location.pathname)) {
      setStarActive(true)
    }
    const cover = animate(progress, 1, { duration: 0.42, ease: EASE })
    const revealTimer = setTimeout(() => {
      animate(progress, 0, { duration: 0.55, ease: EASE })
    }, 470)
    return () => {
      cover.stop()
      clearTimeout(revealTimer)
    }
  }, [location.pathname, progress, reduced])

  const routes = (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/education" element={<Education />} />
      <Route path="/proyectos/:slug" element={<ProjectDetail />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )

  if (reduced) {
    return <>{routes}</>
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {routes}
      </AnimatePresence>
      <Sweep progress={progress} />
      <StarTransition active={starActive} onComplete={handleStarComplete} />
    </>
  )
}
```

---

## 3. Edge Cases

### 3.1 Rapid Navigation (double/triple quick clicks)

**Problem:** User clicks two menu links within 750ms. `starActive` is already `true` when the second transition fires.

**Solution:** The second route change sets `starActive = true` again (no-op if already true) and the shader loop keeps running. The `onComplete` callback fires for the *first* cycle, setting `active = false`, which would kill the loop mid-second-transition.

**Fix:** Do NOT reset `starActive` to `false` inside `onComplete` if a new route change happened during the cycle. Instead:

- In `AnimatedRoutes.tsx`, track a `starGeneration` counter (ref, incrementing integer). On each inter-menu transition, increment it. Pass it as a `key` prop to `StarTransition` so it remounts fresh on rapid navigation. But remounting kills the WebGL context.

**Better fix — generation counter inside StarTransition:**

Add a `generation` prop to `StarTransition`. When `active` transitions to `true`, capture the current generation. In `onComplete`, only call the callback if the generation hasn't changed. In `AnimatedRoutes`, increment a ref on each inter-menu transition and pass it:

```ts
// AnimatedRoutes
const starGen = useRef(0)

// In useEffect, when inter-menu detected:
starGen.current += 1
setStarActive(true)

// Render:
<StarTransition active={starActive} onComplete={handleStarComplete} generation={starGen.current} />
```

```ts
// StarTransition
useEffect(() => {
  genOnStartRef.current = generation
  // ... start loop
}, [active, generation])

// In renderFrame, on completion:
if (genOnStartRef.current === generation) {
  onCompleteRef.current()
}
```

This way, if a second transition fires during the first cycle, `generation` increments, and the first cycle's `onComplete` becomes a no-op. The shader just keeps rendering seamlessly.

### 3.2 WebGL Not Available

**Fallback:** If `canvas.getContext('webgl')` returns `null`, store `null` in `glRef`. In the activation `useEffect`, check `if (!glRef.current) return` — the star transition simply doesn't play. The Sweep still runs (it's independent), so the user gets a normal transition. No error boundary needed — silent degradation.

### 3.3 Tab Hidden / Background

When the tab is hidden, `requestAnimationFrame` stops firing. When the tab comes back, the elapsed time will have jumped (e.g., from 200ms to 5000ms). The cycle would finish instantly.

**Fix:** Use `document.visibilityState` in the rAF loop. If the tab was hidden, reset `startTimeRef` to `performance.now()` to restart the cycle cleanly:

```ts
// In renderFrame:
if (document.visibilityState === 'hidden') {
  // Tab was backgrounded; reset start time on return
  startTimeRef.current = performance.now()
  rafRef.current = requestAnimationFrame(renderFrame)
  return
}
```

Or simpler: clamp elapsed to `TOTAL_DURATION` and call `onComplete` if the tab was hidden for longer than the cycle. The 150ms fade-out handles the visual transition regardless.

**Simplest robust approach:** Track `lastFrameTime`. If delta > 100ms (tab was hidden or lagged), snap `elapsed` to `TOTAL_DURATION` and end the cycle.

### 3.4 Unmount During Active Transition

If the component unmounts while `active` is true (e.g., user navigates away from the app), the cleanup in `useEffect` for `active` cancels the `requestAnimationFrame`. The WebGL cleanup in the mount `useEffect` cleanup deletes the program and buffers. No leaks.

### 3.5 Canvas Opacity Reset on Rapid Navigation

When `starActive` goes `false` (via `onComplete`), the `useEffect` watching `active` resets opacity to `1` immediately. This prepares for the next cycle. If a new cycle starts before the CSS transition completes, the forced opacity `1` + new `active = true` triggers the fade-out timer again cleanly.

---

## 4. Z-Index Verification

| Layer | z-index | Notes |
|-------|---------|-------|
| Sweep | 90 | Existing, unchanged |
| **Star canvas** | **95** | **New** — between Sweep and Grain |
| Grain | 115 | Existing, unchanged |
| Cursor | 119-120 | Existing |

The opaque star canvas (background `#0A0A0A`) covers the Sweep at z-90. Grain at z-115 renders on top of the star canvas — this is fine; the grain is a subtle overlay and adds texture to the star shader output.

---

## 5. Performance Notes

- **WebGL init:** One-time cost (~1ms). Two shader compiles, one buffer upload.
- **Per-frame cost:** One uniform update + one draw call of 4 vertices. Negligible GPU load.
- **Memory:** One `<canvas>` element (always mounted), one WebGL context. No textures, no framebuffers.
- **RAF discipline:** Loop only runs during active 750ms cycles. Zero CPU cost between transitions.
- **CSS:** `position: fixed; inset: 0` — no layout recalculation. `opacity` transition is GPU-composited.
- **No `devicePixelRatio`:** The shader is abstract; rendering at 1x is intentional and keeps the canvas small.

---

## 6. Implementation Sequence

### Step 1: Create `StarTransition.tsx`

1. Define the component with props interface.
2. Set up all `useRef` hooks.
3. Implement the WebGL init `useEffect` (compile, link, buffer, uniforms).
4. Implement the resize `useEffect`.
5. Implement the activation `useEffect` (start/stop loop).
6. Implement `renderFrame` function.
7. Implement the fade-out `useEffect`.
8. Implement `onComplete` ref sync `useEffect`.
9. Return the `<canvas>` element with proper styling.
10. Add generation-based rapid-navigation guard.

### Step 2: Modify `AnimatedRoutes.tsx`

1. Add `useState` and `useCallback` to imports.
2. Add `StarTransition` import.
3. Add `MENU_PATHS` constant.
4. Add `starActive` state and `starGen` ref.
5. Modify the `useEffect`: capture `from` before updating `prevPath`, add inter-menu detection.
6. Add `handleStarComplete` callback.
7. Add `<StarTransition>` to the render output.
8. Run `typecheck` and `lint`.

### Step 3: Verify

1. `npm run typecheck` — zero errors.
2. `npm run lint` — zero errors.
3. Manual test: navigate between menu pages, verify star shader plays.
4. Manual test: navigate from home to menu page — verify Sweep only (no star).
5. Manual test: rapid clicks between menu pages — verify no visual glitches.
6. Manual test: `prefers-reduced-motion` — verify no shader, plain transitions.
7. Manual test: open DevTools, disable WebGL — verify silent fallback.
8. Manual test: switch tabs during transition, come back — verify clean completion.

---

## 7. Summary of What Stays Untouched

- `Sweep.tsx` — no changes
- `Screen.tsx` — no changes
- `Layout.tsx` — no changes
- `Grain.tsx` — no changes
- `package.json` — no new dependencies
- All page components — no changes
- Routing config — no changes
