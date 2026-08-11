/**
 * Scanlines horizontales sutiles ("menú digital") — solo del menú
 * principal. Decorativa (aria-hidden).
 */
export function ScanlineOverlay() {
  return (
    <div
      aria-hidden="true"
      className="hero-scanlines pointer-events-none absolute inset-0 z-[2] bg-scanlines [mix-blend-mode:overlay]"
    />
  )
}
