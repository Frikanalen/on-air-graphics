import { createContext } from "react"
import { DEFAULT_BUDGET_MS } from "../constants.ts"

export type AppState = "idle" | "active" | "exit"

export interface AppContextT {
  /** Animation state */
  state: AppState
  /**
   * How long the playout system has given the graphics, in milliseconds, as it
   * arrived in ?duration=. What the planner is asked to fill; not necessarily
   * what it manages to fill, since a budget too small for anything on offer is
   * overrun rather than honoured.
   */
  budget: number
}

export const AppContext = createContext<AppContextT>({
  budget: DEFAULT_BUDGET_MS,
  state: "idle",
})
