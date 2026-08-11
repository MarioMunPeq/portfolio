/**
 * Mancha de tinta roja difuminada detrás de la navegación de comandos.
 * Decorativa (aria-hidden).
 */
export function InkBlot() {
  return (
    <div
      aria-hidden="true"
      className="hero-inkblot pointer-events-none absolute right-[2%] top-[38%] z-[1] h-[46vw] w-[46vw] -translate-y-1/2 bg-accent opacity-[0.16] blur-[60px] [clip-path:polygon(30%_0%,70%_5%,100%_35%,90%_70%,60%_100%,20%_90%,0%_55%)]"
    />
  )
}
