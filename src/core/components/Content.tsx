import { useContext } from "react"
import classNames from "classnames"
import { RESOLUTION } from "../constants"
import { Player } from "../../sequencing/components/Player"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"
import { useRenderedSegments } from "../../sequencing/clock/useRenderedSegments"
import { AppContext } from "./AppContext.tsx"
import { Background } from "./Background"
import { UnavailableView } from "./UnavailableView"

const [width, height] = RESOLUTION

export function Content() {
  const playhead = useContext(PlayheadContext)
  const plan = useTimelinePlan()
  const app = useContext(AppContext)

  /*
   * The background is a sibling of the player rather than one of its layers --
   * the player's overlay gradient is a pseudo-element, which would paint under
   * a real child. So the frame's own state is read here, from the same cached
   * snapshot the player renders from.
   */
  const rendered = useRenderedSegments(playhead, plan)
  const current = rendered[rendered.length - 1]

  /*
   * Playout asks for the notice with ?unavailable=<title> in a scheduled
   * programme's slot when its file never arrived; an empty title stands for
   * several missing programmes in a row.
   */
  const unavailable = new URLSearchParams(window.location.search).get(
    "unavailable",
  )

  return (
    <div
      className="relative overflow-hidden bg-transparent text-normal"
      style={{ width, height }}
    >
      {/*
       * The whole frame leaves as one piece when the playout system says stop:
       * background, views and overlay on a single curve, over the fade the
       * planner reserves off the top of the budget for exactly this.
       *
       * The group fade is a backdrop root, so anything the cards' backdrop
       * -filter is meant to blur has to sit inside this element -- which is why
       * the background is a child of it and not a sibling. Blur source outside
       * the group and the cards would flatten to plain translucent panels for
       * the length of the fade.
       */}
      <div
        className={classNames(
          "absolute inset-0",
          "transition-opacity duration-(--fk-fade-transition) ease-[ease]",
          app.state === "active" ? "opacity-100" : "opacity-0",
        )}
      >
        <Background
          blurred={
            unavailable !== null || current?.spec.blurBackground === true
          }
        />

        {unavailable !== null ? (
          <UnavailableView title={unavailable} />
        ) : (
          <Player plan={plan} playhead={playhead} />
        )}
      </div>
    </div>
  )
}
