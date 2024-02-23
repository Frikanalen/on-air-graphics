import { createContext } from "react"
import { MINIMUM_SCREEN_TIME } from "../constants.ts"

export type AppState = "idle" | "active" | "exit"

export interface AppContextT {
  /** Animation state */
  state: AppState
  /** The total duration of the graphics being shown */
  duration: number
  /** Is the graphics superimposed on top of the stream? */
  keyed: boolean
}

export const AppContext = createContext<AppContextT>({
  duration: MINIMUM_SCREEN_TIME,
  state: "idle",
  keyed: false,
})
