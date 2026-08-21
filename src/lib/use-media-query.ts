import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

/**
 * SSR-safe hook that returns `true` when the given CSS media query matches.
 * Re-evaluates on window resize.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
