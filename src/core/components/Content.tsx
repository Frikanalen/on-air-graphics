import { useContext } from "react"
import { RESOLUTION } from "../constants"
import { Player } from "../../sequencing/components/Player"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"

const [width, height] = RESOLUTION

export function Content() {
  const playhead = useContext(PlayheadContext)
  const plan = useTimelinePlan()

  return (
    <div
      className="relative overflow-hidden bg-transparent text-normal"
      style={{ width, height }}
    >
      {/*
       * Nothing here may fade the views as a group. An ancestor at opacity < 1
       * is a backdrop root, which cuts the cards' backdrop-filter off from what
       * it is meant to blur and flattens them for the length of the fade. Each
       * view carries its own entrance and exit instead.
       */}
      <Player plan={plan} playhead={playhead} />
    </div>
  )
}
