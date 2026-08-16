import { useContext } from "react"
import classNames from "classnames"
import { AppContext } from "../../core/components/AppContext.tsx"
import { useRenderedSegments } from "../clock/useRenderedSegments"
import { type Playhead } from "../clock/playhead"
import { type Plan } from "../plan/types"

export interface PlayerProps {
  plan: Plan
  playhead: Playhead
}

/**
 * Puts the plan on screen. It holds no timers and no notion of "next": what is
 * showing is a function of where the playhead is, which is what lets the dev
 * panel scrub to any instant and see the frame that would have aired.
 */
export function Player(props: PlayerProps) {
  const { plan, playhead } = props

  const app = useContext(AppContext)
  const rendered = useRenderedSegments(playhead, plan)

  // The last entry owns the instant; anything before it is still animating out.
  const active = rendered[rendered.length - 1]
  const overlay = active?.spec.overlay !== false && app.state === "active"

  return (
    <div
      className={classNames(
        // Fills the frame, so the views and the overlay share its box.
        "absolute top-0 left-0 h-full w-full",
        "before:absolute before:inset-0 before:content-['']",
        "before:transition-opacity before:duration-(--fk-fade-transition) before:ease-[ease]",
        app.keyed
          ? "before:bg-transparent"
          : "before:bg-[image:var(--fk-gradient-overlay)]",
        overlay ? "before:opacity-100" : "before:opacity-0",
      )}
    >
      {app.state === "active" &&
        rendered.map((segment) => (
          /*
           * Keyed by generation as well as position, so that scrubbing back
           * into a view remounts it and its entrance animation runs again.
           * On air the generation never moves, so nothing remounts.
           */
          <div
            key={`${plan.tierName}:${segment.index}:${playhead.generation}`}
            className="absolute top-0 left-0 h-full w-full"
          >
            {segment.spec.render(segment.time)}
          </div>
        ))}
    </div>
  )
}
