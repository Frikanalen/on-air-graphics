import { useContext, useRef } from "react"
import { AppContext } from "../../core/components/AppContext"
import { StationClock } from "../../core/components/StationClock"
import { sceneAt } from "../../graphics/scene"
import { useFrame } from "../../graphics/useFrame"
import { useRenderedSegments } from "../clock/useRenderedSegments"
import { type Playhead } from "../clock/playhead"
import { type Plan } from "../plan/types"

export interface PlayerProps {
  plan: Plan
  playhead: Playhead
}
export function Player({ plan, playhead }: PlayerProps) {
  const app = useContext(AppContext)
  const rendered = useRenderedSegments(playhead, plan)
  const root = useRef<HTMLDivElement>(null)
  useFrame((timestamp) => {
    const scene = sceneAt(plan, playhead.now(), timestamp)
    const el = root.current
    if (!el) return
    for (const view of el.querySelectorAll<HTMLElement>("[data-segment]")) {
      view.style.opacity = String(
        Number(view.dataset.segment) === scene.index
          ? scene.incoming
          : scene.outgoing,
      )
    }
    const clock = el.querySelector<HTMLElement>(".station-clock")
    if (clock) {
      clock.style.opacity = String(scene.clock)
      clock.classList.toggle(
        "on-red",
        scene.name === "poster" || scene.name.startsWith("news:"),
      )
    }
  }, playhead)
  return (
    <div
      ref={root}
      className="player"
      style={{ opacity: app.state === "active" ? 1 : 0 }}
    >
      {app.state !== "idle" &&
        rendered.map((segment) => (
          <div
            key={`${plan.tierName}:${segment.index}:${playhead.generation}`}
            className="view-layer"
            data-segment={segment.index}
          >
            {segment.spec.render(segment.time)}
          </div>
        ))}
      <StationClock />
    </div>
  )
}
