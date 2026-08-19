import { useEffect, useState } from "react";

/**
 * Señal de arranque: el LoadScreen marca `booted` cuando empieza a
 * apartarse y el Hero retrasa su entrada de montaje hasta entonces,
 * de modo que la composicion se revela al mismo tiempo que el barrido
 * de carga se va. Con reduced-motion se marca inmediatamente.
 */
let booted = false;
const listeners = new Set<() => void>();

export function markBooted() {
  if (booted) return;
  booted = true;
  listeners.forEach((listener) => listener());
}

export function isBooted() {
  return booted;
}

export function useBooted(): boolean {
  const [value, setValue] = useState(isBooted());

  useEffect(() => {
    if (booted) setValue(true);
    const listener = () => setValue(true);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return value;
}
