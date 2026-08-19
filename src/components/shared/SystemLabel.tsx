import type { ElementType, ReactNode } from "react";

interface SystemLabelProps {
  children: ReactNode;
  /** Etiqueta semantica (span, p, div…). */
  as?: ElementType;
  className?: string;
}

/**
 * Etiqueta tipo "interfaz de sistema": mayusculas, tono label del sistema
 * y tracking amplio configurable. Reutilizable como patron de microcopy en
 * todo el sitio (topbars, footers, metadata).
 */
export function SystemLabel({
  children,
  as: Tag = "span",
  className = "",
}: SystemLabelProps) {
  return (
    <Tag
      font="sans"
      className={`inline-flex items-center gap-2 text-label font-medium uppercase ${className}`}
    >
      {children}
    </Tag>
  );
}
