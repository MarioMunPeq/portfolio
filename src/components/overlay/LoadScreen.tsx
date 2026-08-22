import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { markBooted } from "../../lib/boot";
import { profile } from "../../data/profile";
import { ConcentricRings } from "./ConcentricRings";
import { HudCorners } from "./HudCorners";
import loadingBg from "../../assets/loading/loadingscreenbackground.webp";

const PROGRESS_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const EXIT_EASE: [number, number, number, number] = [0.85, 0, 0.15, 1];
const LOAD_DURATION = 3.5;

const SURVEY_QUESTIONS = ["¿Viaje antes que destino?"];
const MASK_SRC = `${import.meta.env.BASE_URL}images/ui/persona-mask.png`;

const REVEAL_START = 0.08;
const REVEAL_END = 0.52;
const IMPACT_AT = 0.55;

/** Background shared by tear shards — same gradient + skyline as the loading screen. */
const LOADING_BG = `linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.88)), url(${loadingBg})`;

/** Diagonal tear shard definitions — irregular slices ~15-20deg. */
const TEAR_SHARDS = [
  {
    clipPath: "polygon(0 0, 48% 0, 38% 100%, 0 100%)",
    exitX: "-110%",
    exitY: "-6%",
    exitRotate: -4,
    delay: 0,
  },
  {
    clipPath: "polygon(38% 0, 78% 0, 68% 100%, 28% 100%)",
    exitX: "0%",
    exitY: "-110%",
    exitRotate: 2,
    delay: 0.07,
  },
  {
    clipPath: "polygon(68% 0, 100% 0, 100% 100%, 58% 100%)",
    exitX: "110%",
    exitY: "6%",
    exitRotate: 5,
    delay: 0.14,
  },
];

let loadScreenShown = false;

export function LoadScreen() {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(loadScreenShown);
  const [visible, setVisible] = useState(false);
  const [exitScan, setExitScan] = useState(false);
  const [impact, setImpact] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  /* --- Exit states --- */
  const [mainFading, setMainFading] = useState(false);
  const [tearing, setTearing] = useState(false);
  const [pollExiting, setPollExiting] = useState(false);

  const progress = useMotionValue(0);
  const impactScale = useMotionValue(1);
  const glowBoost = useMotionValue(0);

  /* --- Mask exit (imperative — immune to React re-renders) --- */
  const maskExitOpacity = useMotionValue(1);
  const maskExitY = useMotionValue("0%");
  const maskExitScale = useMotionValue(1);

  /* --- Mask reveal (during loading phase) --- */
  const revealEdge = useTransform(
    progress,
    [REVEAL_START, REVEAL_END],
    [0, 100],
  );
  const maskClip = useTransform(
    revealEdge,
    (x) => `polygon(0% 0%, ${x}% 0%, ${x + 45}% 100%, 0% 100%)`,
  );
  const maskOpacity = useTransform(progress, [0, 0.09], [0, 1]);
  const maskScale = useTransform(
    progress,
    [REVEAL_START, IMPACT_AT],
    [0.99, 1],
  );
  const maskCombinedScale = useTransform(
    [maskScale, impactScale],
    (v: number[]) => v[0] * v[1],
  );
  const maskFilter = useTransform(
    progress,
    [0.25, IMPACT_AT],
    [
      "drop-shadow(0 0 4px rgba(230,0,18,0.22)) drop-shadow(0 0 10px rgba(230,0,18,0.12)) drop-shadow(0 0 28px rgba(230,0,18,0.06))",
      "drop-shadow(0 0 6px rgba(230,0,18,0.5)) drop-shadow(0 0 16px rgba(230,0,18,0.28)) drop-shadow(0 0 42px rgba(230,0,18,0.12))",
    ],
  );
  const scanTop = useTransform(progress, [0.16, 0.5], ["0%", "100%"]);
  const scanOpacity = useTransform(
    progress,
    [0.16, 0.2, 0.46, 0.5],
    [0, 0.55, 0.55, 0],
  );
  const impactFired = useRef(false);
  const exitStarted = useRef(false);

  const hide = useCallback(() => {
    setHidden(true);
  }, []);

  const skip = useCallback(() => {
    if (!hidden) {
      setHidden(true);
      markBooted();
    }
  }, [hidden]);

  /** Exit sequence: poll exits early → main fades → shards tear → mask flies away → hide. */
  const startExit = useCallback(() => {
    if (exitStarted.current) return;
    exitStarted.current = true;
    animate(impactScale, [1, 1.022, 1], {
      duration: 0.26,
      ease: "easeOut",
    });
    setExitScan(true);
    setPollExiting(true);
    setMainFading(true);
    setTearing(true);
    window.setTimeout(() => {
      animate(maskExitOpacity, 0, { duration: 0.4, ease: EXIT_EASE });
      animate(maskExitY, "-12%", { duration: 0.4, ease: EXIT_EASE });
      animate(maskExitScale, 1.12, { duration: 0.4, ease: EXIT_EASE });
    }, 180);
    window.setTimeout(hide, 680);
  }, [hide, impactScale, maskExitOpacity, maskExitY, maskExitScale]);

  /* Barra y porcentaje: escritura directa en el DOM (sin re-renders). */
  useMotionValueEvent(progress, "change", (value) => {
    if (pctRef.current)
      pctRef.current.textContent = String(Math.round(value * 100));
    if (barRef.current) barRef.current.style.width = `${value * 100}%`;
    if (value >= IMPACT_AT && !impactFired.current && !reduced) {
      impactFired.current = true;
      animate(impactScale, [1, 1.018, 1], {
        duration: 0.34,
        times: [0, 0.4, 1],
        ease: "easeOut",
      });
      animate(glowBoost, [0, 0.45, 0], {
        duration: 0.5,
        times: [0, 0.3, 1],
        ease: "easeOut",
      });
      setImpact(true);
    }
  });

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    const i = Math.floor(Math.random() * SURVEY_QUESTIONS.length);
    setQuestion(SURVEY_QUESTIONS[i]);
  }, []);

  /* Simulated loading 0 → 1. */
  useEffect(() => {
    if (!visible) return;
    const controls = animate(progress, 1, {
      duration: LOAD_DURATION,
      ease: PROGRESS_EASE,
      onComplete: () => {
        markBooted();
        if (reduced) hide();
        else startExit();
      },
    });
    /* Safety: force-hide after 6s even if animation or exit stalls. */
    const safety = window.setTimeout(() => {
      markBooted();
      hide();
    }, 6000);
    return () => {
      controls.stop();
      window.clearTimeout(safety);
    };
  }, [progress, visible, reduced, hide, startExit]);

  if (hidden) return null;

  return (
    <>
      {/* ============================================================
          MAIN CONTENT — fades out quickly at exit (z-100)
          ============================================================ */}
      <motion.div
        className="loadscreen-content fixed inset-0 z-[100] overflow-hidden bg-bg-hero text-paper"
        animate={{ opacity: mainFading ? 0 : 1 }}
        transition={{ duration: 0.22 }}
        onPointerDown={skip}
        aria-hidden="true"
      >
        {/* Fondo: skyline real con rampa de brillo */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.88)), url(${loadingBg})`,
            backgroundSize: "cover, cover",
            backgroundPosition: "center, center",
          }}
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 1, scale: reduced ? 1 : 1.015 }}
          transition={{ duration: LOAD_DURATION, ease: "easeOut" }}
        />

        {/* Rim-light rojo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-[160px]"
          style={{
            top: "32%",
            background:
              "linear-gradient(to bottom, transparent, rgba(230,0,18,0.4) 50%, transparent)",
            filter: "blur(48px)",
            mixBlendMode: "screen",
            opacity: 0.24,
          }}
        />

        {/* FASE 1 — AUSENCIA: indicios */}
        {!reduced && (
          <>
            <div
              aria-hidden="true"
              className="load-scan-v pointer-events-none absolute inset-y-0 z-30 w-px bg-accent"
            />
            <div
              aria-hidden="true"
              className="load-core-line pointer-events-none absolute z-30 h-px -translate-x-1/2 -translate-y-1/2 bg-accent"
              style={{ left: "50%", top: "50%" }}
            />
          </>
        )}

        <ConcentricRings revealed={impact} reduced={!!reduced} />

        {/* Destello radial del impacto */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: glowBoost,
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(230,0,18,0.4), transparent 55%)",
              mixBlendMode: "screen",
            }}
          />
        )}

        <HudCorners />

        {/* HUD periferico superior */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        >
          <div className="flex items-center justify-between px-6 pt-6 text-label uppercase tracking-[0.3em] text-paper/45 md:px-10">
            <span className="flex items-center gap-2">
              <span className="inline-block size-[3px] bg-accent" />
              {profile.branding.system.toUpperCase()}
            </span>
            <span className="hidden sm:block">
              SISTEMA {profile.branding.version.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Micro-marcas laterales */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 hidden flex-col items-center lg:flex"
          style={{
            top: "50%",
            left: "20%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="h-[44px] w-px bg-paper/12" />
          <span className="mt-[10px] h-[2px] w-[7px] bg-accent/60" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 hidden flex-col items-center lg:flex"
          style={{
            top: "50%",
            right: "20%",
            transform: "translate(50%, -50%)",
          }}
        >
          <span className="h-[44px] w-px bg-paper/12" />
          <span className="mt-[10px] h-[2px] w-[7px] bg-accent/60" />
        </div>

        {/* Barrido de salida */}
        {exitScan && !reduced && (
          <div
            aria-hidden="true"
            className="load-exit-scan pointer-events-none absolute inset-x-0 z-40 h-[2px] bg-accent"
            style={{ boxShadow: "0 0 14px rgba(230,0,18,0.7)" }}
          />
        )}

        {/* Progreso — poll panel exits early (slide right + fade) */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0 : 0.6,
            delay: reduced ? 0 : 0.25,
          }}
        >
          <motion.div
            className="load-base absolute inset-x-0 bottom-0 h-[min(38vh,380px)] w-full"
            animate={{
              x: pollExiting ? "20%" : "0%",
              opacity: pollExiting ? 0 : 1,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute bottom-12 right-6 z-20 w-[min(35rem,80vw)]">
              <div className="load-panel">
                <div className="load-panel-inner px-7 pb-6 pt-[6.5rem]">
                  <p
                    className="load-question max-w-full truncate pl-[2.5rem] text-left font-anton uppercase leading-[1.05] text-paper"
                    style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)" }}
                  >
                    {question && (
                      <>
                        {question.slice(0, -1)}
                        <span className="text-accent">?</span>
                      </>
                    )}
                  </p>

                  <div className="load-bar-block relative mt-2 flex items-center pl-[2.5rem]">
                    <span
                      aria-hidden="true"
                      className="load-q absolute bottom-[50px] left-0 font-anton text-[5.5rem] leading-none text-paper [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,-3px_-3px_0_#000,3px_-3px_0_#000,-3px_3px_0_#000,3px_3px_0_#000]"
                    >
                      Q
                    </span>

                    <div className="relative h-[52px] w-full [transform:skewX(-6deg)]">
                      <div className="absolute inset-0 bg-paper [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                        <div className="absolute inset-[3px] bg-bg-hero [clip-path:polygon(0%_25%,100%_0%,100%_100%,0%_75%)]">
                          <div
                            ref={barRef}
                            className={`absolute inset-y-0 left-0 bg-accent${reduced ? "" : " bar-breathe"}`}
                          />
                        </div>
                      </div>
                    </div>

                    <span className="load-pct ml-4 shrink-0 font-anton text-[3.5rem] leading-none text-accent [transform:skewX(-10deg)] [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,-3px_-3px_0_#000,3px_-3px_0_#000,-3px_3px_0_#000,3px_3px_0_#000,4px_4px_0_rgba(0,0,0,0.5)]">
                      Si{" "}
                      <span className="inline-block min-w-[4.5ch] text-right tabular-nums">
                        <span ref={pctRef}>0</span>%
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ============================================================
          MASK — separate layer for special exit treatment (z-101).
          Stays visible ~100ms longer than the main content, then is
          violently pulled upward as the final focal piece.
          ============================================================ */}
      <motion.div
        className="fixed inset-0 z-[101] pointer-events-none"
        style={{
          opacity: maskExitOpacity,
          y: maskExitY,
          scale: maskExitScale,
        }}
      >
        <div
          className="pointer-events-none absolute"
          style={{ left: "50%", top: "50%" }}
        >
          <div
            className="relative w-[min(82vw,560px)] max-w-none"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              className="relative w-full max-w-none"
              style={{
                clipPath: reduced ? "none" : maskClip,
              }}
            >
              <motion.img
                src={MASK_SRC}
                alt=""
                draggable={false}
                className="block w-full max-w-none relative z-[1]"
                style={{
                  scale: reduced ? 1 : maskCombinedScale,
                  opacity: reduced ? 1 : maskOpacity,
                  filter: reduced ? "none" : maskFilter,
                }}
              />

              {/* Layered glow — tight inner + medium + soft outer halo, breathing pulse */}
              {!reduced && (
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 z-0"
                  style={{
                    opacity: 0.65,
                    background: [
                      "radial-gradient(circle at 50% 50%, rgba(230,0,18,0.38) 0%, transparent 18%)",
                      "radial-gradient(circle at 50% 50%, rgba(230,0,18,0.16) 0%, transparent 35%)",
                      "radial-gradient(circle at 50% 50%, rgba(230,0,18,0.06) 0%, transparent 55%)",
                    ].join(", "),
                    mixBlendMode: "screen",
                  }}
                />
              )}

              {/* FASE 2 — REVELADO: linea de escaneo */}
              {!reduced && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 h-px bg-accent"
                  style={{
                    top: scanTop,
                    opacity: scanOpacity,
                    boxShadow: "0 0 12px rgba(230,0,18,0.65)",
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* FASE 3 — IMPACTO: diamantes */}
          {!reduced && impact && (
            <>
              <span
                className="load-impact-diamond absolute left-0 top-0 size-[5px] bg-accent"
                style={{ "--dx": "-22px", "--dy": "-22px" } as CSSProperties}
              />
              <span
                className="load-impact-diamond absolute right-0 top-0 size-[5px] bg-accent"
                style={{ "--dx": "22px", "--dy": "-22px" } as CSSProperties}
              />
              <span
                className="load-impact-diamond absolute bottom-0 left-0 size-[5px] bg-accent"
                style={{ "--dx": "-22px", "--dy": "22px" } as CSSProperties}
              />
              <span
                className="load-impact-diamond absolute bottom-0 right-0 size-[5px] bg-accent"
                style={{ "--dx": "22px", "--dy": "22px" } as CSSProperties}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* ============================================================
          TEAR SHARDS — diagonal panels that fly apart (z-102).
          Each shard shows the same background in a diagonal slice,
          then translates away in a different direction.
          ============================================================ */}
      {tearing && !reduced && (
        <div className="fixed inset-0 z-[102] pointer-events-none">
          {TEAR_SHARDS.map((shard, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                backgroundImage: LOADING_BG,
                backgroundSize: "cover, cover",
                backgroundPosition: "center, center",
                clipPath: shard.clipPath,
              }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: shard.exitX,
                y: shard.exitY,
                rotate: shard.exitRotate,
                opacity: 0,
              }}
              transition={{
                duration: 0.55,
                delay: shard.delay,
                ease: EXIT_EASE,
              }}
            />
          ))}
          {/* Brief red diagonal flash — existing P5 graphic language */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, transparent 42%, rgba(230,0,18,0.25) 50%, transparent 58%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
      )}
    </>
  );
}
