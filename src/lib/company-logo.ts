/**
 * Logos de empresas para la seccion Experiencia laboral (basado en archivos).
 *
 * Para añadir el logo de una empresa NO hace falta tocar codigo:
 *   1. Colocar el archivo en  public/images/experience/
 *   2. Nombrarlo con el nombre de la empresa:
 *        michelin.png · synersight.webp · cognizant.png
 *   3. El logo se resuelve automaticamente desde el campo `company`
 *      (se busca primero .png y luego .webp; sin archivo se muestra
 *      la inicial de la empresa como placeholder).
 *
 * El nombre se normaliza solo: minusculas, sin acentos, espacios → guiones,
 * y se ignoran sufijos legales comunes (", S.L.", " Inc.", etc.).
 */

/** Formatos admitidos, en orden de prioridad. */
const LOGO_EXTENSIONS = ['png', 'webp'] as const

/** Sufijos legales comunes que se ignoran al generar el slug. */
const LEGAL_SUFFIX =
  /^(.*?)(?:\s*,\s*|\s+)(?:s\.l\.?u?\.?|s\.a\.?u?\.?|s\.r\.l\.?|s\.p\.a\.?|ltd\.?|inc\.?|llc\.?|gmbh)$/i

/**
 * Normaliza el nombre de la empresa a un slug de archivo tolerante:
 * "Michelin" → "michelin" · "Synersight, S.L." → "synersight"
 * · "Diputacion de Valladolid" → "diputacion-de-valladolid".
 */
export function companyToSlug(company: string): string {
  const base = company.match(LEGAL_SUFFIX)?.[1] ?? company.split(',')[0]
  return base
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Rutas candidatas del logo para una empresa, en orden de prioridad
 * (.png primero, luego .webp). Se construyen sobre la base real del
 * proyecto (import.meta.env.BASE_URL) y public/images/experience/.
 */
export function companyLogoCandidates(company: string): string[] {
  const slug = companyToSlug(company)
  return LOGO_EXTENSIONS.map(
    (ext) => `${import.meta.env.BASE_URL}images/experience/${slug}.${ext}`,
  )
}
