import { useSyncExternalStore } from "react"
import { type Playhead } from "./playhead"

/**
 * Whether the playhead is running. It notifies every frame, but this is a
 * boolean -- React bails out of the re-render whenever it has not changed.
 */
export const usePlayheadPlaying = (playhead: Playhead): boolean =>
  useSyncExternalStore(
    playhead.subscribe,
    () => playhead.playing,
    () => false,
  )
