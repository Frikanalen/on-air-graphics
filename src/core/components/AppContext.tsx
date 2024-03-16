import { createContext } from "react"
import { MINIMUM_SCREEN_TIME } from "../constants.ts"

export type AppState = "idle" | "active" | "exit"

export enum PageAnimationState {
  // The page should load its data etc, but stay hidden.
  Pending,
  // The page is being cued in, begin playing intro animations.
  CueIn,
  // The page is being cued out, begin playing outro animations.
  CueOut,
}

export interface AppContextT {
  /** Animation state */
  state: AppState
  /** The total duration of the graphics being shown */
  durationMs: number
  /** Is the graphics superimposed on top of the stream? */
  keyed: boolean
}

export const AppContext = createContext<AppContextT>({
  durationMs: MINIMUM_SCREEN_TIME,
  state: "idle",
  keyed: false,
})
