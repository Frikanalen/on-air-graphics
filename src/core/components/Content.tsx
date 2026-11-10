import { useContext } from "react"
import { Player } from "../../sequencing/components/Player"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"
import { Background } from "./Background"

export function Content() {
  const playhead = useContext(PlayheadContext)
  const plan = useTimelinePlan()
  return (
    <div className="broadcast-frame">
      <Background plan={plan} />
      <Player plan={plan} playhead={playhead} />
    </div>
  )
}
