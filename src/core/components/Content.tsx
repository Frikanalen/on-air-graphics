import { useContext } from "react"
import { Player } from "../../sequencing/components/Player"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"
import { AppContext } from "./AppContext"
import { Background } from "./Background"
import { UnavailableView } from "./UnavailableView"

export function Content() {
  const playhead = useContext(PlayheadContext)
  const plan = useTimelinePlan()
  const app = useContext(AppContext)
  const unavailable = new URLSearchParams(window.location.search).get(
    "unavailable",
  )
  return (
    <div className="broadcast-frame">
      {unavailable !== null ? (
        <div
          className="player"
          style={{ opacity: app.state === "active" ? 1 : 0 }}
        >
          <UnavailableView title={unavailable} />
        </div>
      ) : (
        <>
          <Background plan={plan} />
          <Player plan={plan} playhead={playhead} />
        </>
      )}
    </div>
  )
}
