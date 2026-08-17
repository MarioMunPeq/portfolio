import { createContext, useContext } from 'react'

const TransitionCtx = createContext(false)

/** Provider — mounted by AnimatedRoutes when a star-mask transition is active. */
export const TransitionProvider = TransitionCtx.Provider

/** Read by Screen to skip enter/exit animations during the mask transition. */
export function useTransitionActive(): boolean {
  return useContext(TransitionCtx)
}
