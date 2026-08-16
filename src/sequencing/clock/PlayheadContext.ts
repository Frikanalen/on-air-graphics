import { createContext } from "react"
import { createPlayhead } from "./playhead"

/*
 * Created once in App, so that the dev panel and the player are driving the
 * same clock: scrubbing has to move the views, not a second copy of the time.
 */
export const PlayheadContext = createContext(createPlayhead())
