import { ActionButton } from '../ui/ActionButton'

/**
 * Botón "CONTACTO" del pie del menú principal: mismo chip angular que
 * "VOLVER AL MENÚ" (ActionButton) para que ambas acciones compartan
 * tamaño y tratamiento. Navega a la sección de contacto.
 */
export function ContactButton() {
  return (
    <ActionButton to="/contact" dataCursor="contact">
      Contacto
    </ActionButton>
  )
}
