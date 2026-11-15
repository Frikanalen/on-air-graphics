import { useContext, useState } from "react"
import { Player } from "../../sequencing/components/Player"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"
import { AppContext } from "./AppContext"
import { Background } from "./Background"
import { MemberPosterView } from "./MemberPosterView"
import { UnavailableView } from "./UnavailableView"
import { usePreviewText } from "../previewChannel"

export function Content() {
  const playhead = useContext(PlayheadContext)
  const plan = useTimelinePlan()
  const app = useContext(AppContext)
  const [sceneReady, setSceneReady] = useState(false)
  const query = new URLSearchParams(window.location.search)
  const unavailable = query.get("unavailable")
  const poster = query.get("poster")
  // An editor framing this page posts the text as it is typed.
  const posted = usePreviewText()
  // A notice or a member's poster holds still for its slot, instead of the
  // sequence.
  const still =
    unavailable !== null ? (
      <UnavailableView title={unavailable} />
    ) : poster !== null ? (
      <MemberPosterView
        template={posted?.template ?? poster}
        look={posted?.look ?? query.get("look")}
        slide={
          posted?.slide !== undefined
            ? String(posted.slide)
            : query.get("slide")
        }
        heading={posted?.heading ?? query.get("heading") ?? ""}
        text={posted?.text ?? query.get("text") ?? ""}
        from={posted?.from ?? query.get("from") ?? ""}
      />
    ) : null
  return (
    <div
      className="broadcast-frame"
      style={{
        visibility: still !== null || sceneReady ? "visible" : "hidden",
        opacity: app.state === "idle" ? 0 : 1,
      }}
    >
      {still !== null ? (
        <div
          className="player"
          style={{ opacity: app.state === "active" ? 1 : 0 }}
        >
          {still}
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
