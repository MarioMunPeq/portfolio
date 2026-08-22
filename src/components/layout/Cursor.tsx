import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";

type CursorColor = "red" | "white";

interface CursorState {
  active: boolean;
  label: string;
  color: CursorColor;
}

const RED = "#e60012";
const PAPER = "#f5f5f0";
const CYAN = "#5ad1ff";

// Etiqueta segun el contexto (data-cursor). El color sigue existiendo para el
// dedupe de estado, aunque el diamante ya no lo use: el tratamiento visual
// (rojo relleno + borde cian fantasma) es fijo en el hover.
const CURSOR_STYLES: Record<string, CursorState> = {
  select: { active: true, label: "SELECCIONAR", color: "white" },
  open: { active: true, label: "ABRIR", color: "white" },
  project: { active: true, label: "VER PROYECTO", color: "white" },
  contact: { active: true, label: "CONTACTO", color: "white" },
  back: { active: true, label: "VOLVER", color: "red" },
};

function resolveCursor(target: Element): CursorState {
  const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
  const key = cursorEl?.dataset.cursor;
  const style = key ? CURSOR_STYLES[key] : undefined;
  if (style) {
    const explicit = cursorEl?.dataset.cursorColor;
    if (explicit === "red" || explicit === "white")
      return { ...style, color: explicit };
    return style;
  }
  // Fallback por semantica cuando no hay data-cursor.
  const href = target.closest("a")?.getAttribute("href") ?? "";
  if (href.startsWith("mailto:")) return CURSOR_STYLES.contact;
  if (href.includes("/proyectos")) return CURSOR_STYLES.project;
  if (href.includes("/contacto")) return CURSOR_STYLES.contact;
  if (href.split("#")[0].endsWith("/")) return CURSOR_STYLES.back;
  return CURSOR_STYLES.select;
}

// Curva rapida y cortante (ease-out exponencial).
const BEZIER: [number, number, number, number] = [0.16, 1, 0.3, 1];
// Transicion de estado del diamante (~180 ms).
const SNAP = { duration: 0.18, ease: BEZIER };
// Compresion al pulsar, aun mas corta (~120 ms).
const PRESS = { duration: 0.12, ease: BEZIER };
// Clip-path wipe de la caja — agresivo, diagonal.
const PUNCH: [number, number, number, number] = [0.65, 0, 0.35, 1];
const WIPE_IN = { duration: 0.15, ease: PUNCH };
const WIPE_OUT = { duration: 0.10, ease: PUNCH };
// Texto interior: delay escalonado respecto al wipe.
const TEXT_IN = { duration: 0.12, ease: "easeOut" as const, delay: 0.06 };
const TEXT_OUT = { duration: 0.06, ease: "easeIn" as const };
// Posicion de la etiqueta respecto al puntero.
const SLIDE = { duration: 0.14, ease: BEZIER };
// Rotacion continua y lenta del diamante, independiente del movimiento.
const SPIN = { duration: 6, ease: "linear" as const, repeat: Infinity };

// Diamante: cuadrado girado 45° (vertices arriba/abajo/izquierda/derecha).
const DIAMOND = "M 12 2.5 L 21.5 12 L 12 21.5 L 2.5 12 Z";

// Clip-path angular de la etiqueta (esquinas cortadas).
const CLIP_OPEN =
  "polygon(5px 0, calc(100% - 3px) 0, 100% 5px, 100% calc(100% - 3px), calc(100% - 5px) 100%, 3px 100%, 0 calc(100% - 5px), 0 3px)";
// Estado oculto: colapsado al borde izquierdo (mismos 8 puntos).
const CLIP_HIDDEN_LEFT =
  "polygon(0 0, 0 0, 0 5px, 0 calc(100% - 5px), 0 100%, 0 100%, 0 calc(100% - 5px), 0 3px)";
// Estado oculto: colapsado al borde derecho.
const CLIP_HIDDEN_RIGHT =
  "polygon(100% 0, 100% 0, 100% 5px, 100% calc(100% - 3px), 100% 100%, 100% 100%, 100% calc(100% - 5px), 100% 3px)";

// Separacion horizontal de la etiqueta respecto al puntero y ancho estimado
// (se reajusta con la medicion real del DOM).
const LABEL_GAP = 24;
const LABEL_EST = 150;

// Factor de easing del fantasma (mas alto = mas pegajoso al puntero).
const GHOST_EASING = 16;

/**
 * Cursor decorativo del sistema — "Diamond Selector". Dos capas de un mismo
 * diamante blanco fino de 2px, inspirado en el marcador de seleccion que ante
 * a los comandos del menu de Persona 5:
 *
 *  - Capa principal: diamante blanco de contorno que rota de forma continua y
 *    lenta (animacion CSS, no ligada al movimiento). En hover crece y se
 *    rellena de rojo solido manteniendo el borde blanco.
 *  - Capa fantasma: copia ligeramente menor, roja, desplazada unos pixeles y
 *    con retraso suavizado respecto al puntero (requestAnimationFrame +
 *    easing exponencial, no 1:1), creando el doble perfil tipo glitch. En
 *    hover su borde pasa a cian.
 *
 * Con `prefers-reduced-motion` o puntero tactil no se monta: se usa el cursor
 * nativo. Cuando esta activo se marca `data-cursor-active` y CSS oculta el
 * nativo (solo punteros finos). La etiqueta contextual se recoloca al otro
 * lado del puntero cerca de los bordes y nunca sale de pantalla.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [cursor, setCursor] = useState<CursorState>({
    active: false,
    label: "SELECCIONAR",
    color: "white",
  });
  const [pressed, setPressed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [lift, setLift] = useState(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Posicion del fantasma: se aproxima a (x, y) con easing por fotograma.
  const ghostX = useMotionValue(-100);
  const ghostY = useMotionValue(-100);

  const viewport = useRef({ w: 1280, h: 720 });
  const flipRef = useRef(false);
  const liftRef = useRef(0);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const labelWidth = useRef(LABEL_EST);

  // Anchura real de la etiqueta (con margen) para el volteo en los bordes.
  useEffect(() => {
    labelWidth.current = labelRef.current
      ? Math.max(LABEL_EST, labelRef.current.offsetWidth + 10)
      : LABEL_EST;
  }, [enabled, cursor.label]);

  useEffect(() => {
    if (reduced) return;

    const hoverQuery = window.matchMedia("(hover: none)");
    if (hoverQuery.matches) return;

    setEnabled(true);
    document.documentElement.setAttribute("data-cursor-active", "true");
    viewport.current = { w: window.innerWidth, h: window.innerHeight };
    ghostX.set(x.get());
    ghostY.set(y.get());

    const disable = () => {
      setEnabled(false);
      setCursor({ active: false, label: "", color: "white" });
      setPressed(false);
      document.documentElement.removeAttribute("data-cursor-active");
    };

    const onResize = () => {
      viewport.current = { w: window.innerWidth, h: window.innerHeight };
    };

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      // Recolocacion de la etiqueta segun el borde del viewport. Solo se
      // actualiza el estado al cruzar el umbral (nunca por fotograma).
      const { w, h } = viewport.current;
      const flip = event.clientX > w - labelWidth.current - LABEL_GAP - 24;
      if (flip !== flipRef.current) {
        flipRef.current = flip;
        setFlipped(flip);
      }
      let next = 0;
      if (event.clientY < 64) next = 1;
      else if (event.clientY > h - 56) next = -1;
      if (next !== liftRef.current) {
        liftRef.current = next;
        setLift(next);
      }
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest(
        'a, button, [role="button"], [data-cursor]',
      );
      if (!interactive) {
        setCursor((prev) => (prev.active ? { ...prev, active: false } : prev));
        return;
      }
      const next = resolveCursor(interactive);
      setCursor((prev) =>
        prev.active && prev.label === next.label && prev.color === next.color
          ? prev
          : next,
      );
    };

    const onDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      setPressed(true);
    };

    const onUp = () => setPressed(false);

    const onLeave = () => {
      setPressed(false);
      setCursor((prev) => (prev.active ? { ...prev, active: false } : prev));
    };

    /* Si el viewport cambia a un layout tactil (rotacion, resize),
       forzar el apagado completo del cursor custom. */
    const onHoverChange = (e: MediaQueryListEvent) => {
      if (e.matches) disable();
    };

    /* Desactivar inmediatamente al detectar cualquier interaccion tactil.
       Un solo touch en un dispositivo hibrido (ej. Surface) debe apagar
       el cursor custom para siempre en esa sesion. */
    const onTouchStart = () => disable();

    hoverQuery.addEventListener("change", onHoverChange);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchstart", onTouchStart, {
      once: true,
      passive: true,
    });

    return () => {
      hoverQuery.removeEventListener("change", onHoverChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, [reduced, x, y, ghostX, ghostY]);

  // Retraso del fantasma: easing exponencial hacia la posicion real del
  // puntero, una vez por fotograma (lag suave, no seguimiento 1:1).
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const k = 1 - Math.exp(-dt * GHOST_EASING);
      ghostX.set(ghostX.get() + (x.get() - ghostX.get()) * k);
      ghostY.set(ghostY.get() + (y.get() - ghostY.get()) * k);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, x, y, ghostX, ghostY]);

  if (!enabled) return null;

  // Hover: el principal se rellena de rojo solido con borde blanco; el borde
  // del fantasma pasa de rojo a cian.
  const ghostStroke = cursor.active ? CYAN : RED;
  const mainFill = cursor.active ? RED : "transparent";

  const labelX = flipped ? -(labelWidth.current + LABEL_GAP) : LABEL_GAP;
  const labelY = lift === 1 ? 26 : lift === -1 ? -58 : -18;

  return (
    <>
      {/* Fantasma retrasado: diamante menor rojo (cian en hover), desplazado
          unos pixeles detras del principal y con lag suavizado. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[10000]"
        style={{ x: ghostX, y: ghostY }}
      >
        <div
          className="-ml-[10px] -mt-[10px]"
          style={{ transform: "translate(8px, 8px)" }}
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="block h-5 w-5"
            animate={{ rotate: 360 }}
            transition={SPIN}
          >
            <path
              d={DIAMOND}
              fill="none"
              stroke={ghostStroke}
              strokeWidth="1.6"
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Capa principal: diamante blanco de 2px que rota de forma continua. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[10001]"
        style={{ x, y }}
      >
        <div className="relative -ml-[12px] -mt-[12px]">
          <motion.div animate={{ rotate: 360 }} transition={SPIN}>
            <motion.div
              className="relative flex h-6 w-6 items-center justify-center"
              animate={{
                scale: pressed ? 0.88 : cursor.active ? 1.7 : 1,
              }}
              transition={pressed ? PRESS : SNAP}
            >
              <svg viewBox="0 0 24 24" className="block h-full w-full">
                <path
                  d={DIAMOND}
                  fill={mainFill}
                  stroke={PAPER}
                  strokeWidth="2"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Etiqueta contextual tipo P5 — wipe diagonal + borde rojo + texto escalonado */}
          <motion.span
            className="pointer-events-none absolute left-0 top-0"
            animate={{
              x: cursor.active ? labelX : labelX + (flipped ? -8 : 8),
              y: cursor.active ? labelY : labelY + 6,
            }}
            transition={SLIDE}
          >
            {/* Capa borde: fondo rojo, 2px mas grande, mismo clip-path */}
            <motion.span
              className="absolute inset-[-2px] bg-accent"
              animate={{
                clipPath: cursor.active
                  ? CLIP_OPEN
                  : flipped
                    ? CLIP_HIDDEN_RIGHT
                    : CLIP_HIDDEN_LEFT,
              }}
              transition={cursor.active ? WIPE_IN : WIPE_OUT}
            />
            {/* Capa contenido: fondo oscuro, texto interior */}
            <motion.span
              ref={labelRef}
              className={`relative block bg-[#0a0a0a] px-5 py-[7px] ${
                flipped ? "text-right" : ""
              }`}
              animate={{
                clipPath: cursor.active
                  ? CLIP_OPEN
                  : flipped
                    ? CLIP_HIDDEN_RIGHT
                    : CLIP_HIDDEN_LEFT,
              }}
              transition={cursor.active ? WIPE_IN : WIPE_OUT}
            >
              {/* Texto interior: ♦ + label, fade+slide escalonado */}
              <motion.span
                className={`block whitespace-nowrap font-display text-[11px] uppercase leading-none tracking-[0.18em] text-paper ${
                  flipped ? "pr-3" : "pl-3"
                }`}
                animate={{
                  opacity: cursor.active ? 1 : 0,
                  y: cursor.active ? 0 : 3,
                }}
                transition={cursor.active ? TEXT_IN : TEXT_OUT}
              >
                ♦ {cursor.label}
              </motion.span>
            </motion.span>
          </motion.span>
        </div>
      </motion.div>
    </>
  );
}
