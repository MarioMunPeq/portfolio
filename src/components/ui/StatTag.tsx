const GOLD = "linear-gradient(135deg, #ffe27d, #ffd84d 55%, #f5b301)";
const CLIP =
  "[clip-path:polygon(2%_3%,5%_0,96%_1%,99%_6%,98%_30%,100%_55%,97%_88%,100%_97%,93%_100%,60%_98%,30%_100%,3%_97%,0_70%,1%_40%,0_8%)]";

interface StatTagProps {
  label: string;
  rank: number;
  descriptor?: string;
  className?: string;
}

/**
 * Sello de atributo social (Social Stats de P5): pegatina dorada de borde
 * rasgado con texto negro, insignia de rango (rectangulo blanco) en la
 * esquina superior izquierda y linea de descriptor bajo la etiqueta.
 */
export function StatTag({
  label,
  rank,
  descriptor,
  className = "",
}: StatTagProps) {
  return (
    <div
      className={`relative inline-flex scale-[0.8] sm:scale-100 ${className}`}
      style={{ filter: "drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.7))" }}
    >
      <div
        className={`relative flex flex-col px-3.5 py-2 ${CLIP}`}
        style={{ background: GOLD }}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex min-w-[1.3rem] items-center justify-center rounded-[2px] bg-white px-1 py-px text-[0.65rem] font-extrabold leading-none text-ink">
            {rank}
          </span>
          <span className="font-p5-menu text-body font-bold uppercase leading-none tracking-[0.06em] text-ink">
            {label}
          </span>
        </div>
        {descriptor ? (
          <span className="mt-1 pl-[1.8rem] font-sans text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.18em] text-ink/75">
            {descriptor}
          </span>
        ) : null}
      </div>
    </div>
  );
}
