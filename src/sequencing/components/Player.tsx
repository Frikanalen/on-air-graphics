import { slatePageAt } from "../../bulletins/slate"
import { heldSlide } from "../../core/previewChannel"
import { useContext, useRef } from "react"
import { AppContext } from "../../core/components/AppContext"
import { StationClock } from "../../core/components/StationClock"
import { MusicCredit } from "../../core/components/MusicCredit"
import { cameraFor, sceneAt } from "../../graphics/scene"
import { useFrame } from "../../graphics/useFrame"
import { useRenderedSegments } from "../clock/useRenderedSegments"
import { type Playhead } from "../clock/playhead"
import { type Plan } from "../plan/types"
import {
  heldSchedulePage,
  schedulePageAt,
  type SchedulePageKind,
} from "../../schedule/cycle"

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
    for (const slate of el.querySelectorAll<HTMLElement>(".org-slate")) {
      const segment =
        plan.segments[
          Number(slate.closest<HTMLElement>("[data-segment]")?.dataset.segment)
        ]
      const pageMs = (slate.dataset.pageMs ?? "").split(",").map(Number)
      // An editor's preview holds one page (`?slide=<n>`, or as it posts).
      const held = heldSlide()
      const shown =
        held !== null
          ? { index: Math.min(held, pageMs.length - 1), opacity: 1 }
          : slatePageAt(pageMs, playhead.now() - (segment?.start ?? 0))
      for (const page of slate.querySelectorAll<HTMLElement>(".slate-page"))
        page.style.opacity = String(
          Number(page.dataset.page) === shown.index ? shown.opacity : 0,
        )
    }
    for (const view of el.querySelectorAll<HTMLElement>("[data-segment]")) {
      const pages = [...view.querySelectorAll<HTMLElement>(".schedule-page")]
      if (!pages.length) continue
      const kinds = pages.map((page) => page.dataset.kind as SchedulePageKind)
      const segment = plan.segments[Number(view.dataset.segment)]
      const held = heldSchedulePage(kinds)
      const shown =
        held !== null
          ? { index: held, opacity: 1 }
          : schedulePageAt(
              kinds,
              segment?.duration ?? 0,
              playhead.now() - (segment?.start ?? 0),
            )
      for (const [index, page] of pages.entries())
        page.style.opacity = String(index === shown.index ? shown.opacity : 0)
    }
    const clock = el.querySelector<HTMLElement>(".station-clock")
    if (clock) {
      clock.style.opacity = String(scene.clock)
      clock.classList.toggle(
        "on-red",
        scene.name === "poster" || scene.name.startsWith("news:"),
      )
    }
    el.querySelector(".music-credit")?.classList.toggle(
      "on-light",
      cameraFor(scene.name) !== "sheet",
    )
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
      <MusicCredit />
    </div>
  )
}
