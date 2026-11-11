import { useContext, useState } from "react"
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
  const [sceneReady, setSceneReady] = useState(false)
  const unavailable = new URLSearchParams(window.location.search).get(
    "unavailable",
  )
  return (
    <div
      className="broadcast-frame"
      style={{
        visibility: unavailable !== null || sceneReady ? "visible" : "hidden",
        opacity: app.state === "idle" ? 0 : 1,
      }}
    >
      {unavailable !== null ? (
        <div
          className="player"
          style={{ opacity: app.state === "active" ? 1 : 0 }}
        >
          <UnavailableView title={unavailable} />
        </div>
      ) : (
        <>
          <Background plan={plan} onReady={setSceneReady} />
          <Player plan={plan} playhead={playhead} />
        </>
      )}
    </div>
  )
}
