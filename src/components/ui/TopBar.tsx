import { Wordmark } from "./Wordmark";

const MONTHS = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SEP", "OCT", "NOV", "DIC",
];

function formatSystemDate(): string {
  const d = new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface TopBarProps {
  /** Version estatica (menu principal): Wordmark sin enlace ni flecha. */
  static?: boolean;
}

/**
 * Barra superior de sistema: franja diagonal rojo/negro (hazard) +
 * dos slots [◀ MARCA] ............. [FECHA].
 */
export function TopBar({ static: isStatic = false }: TopBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-paper/10 bg-bg-hero text-paper">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 md:px-6">
        <Wordmark static={isStatic} />

        <span className="shrink-0 text-label font-medium tabular-nums uppercase tracking-[0.25em] text-paper/50">
          {formatSystemDate()}
        </span>
      </div>
    </div>
  );
}
