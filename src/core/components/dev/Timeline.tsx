import { useEffect, useRef } from "react"
import classNames from "classnames"
import { type Playhead } from "../../../sequencing/clock/playhead"
import { usePlayheadPlaying } from "../../../sequencing/clock/usePlayhead"
import { useRenderedSegments } from "../../../sequencing/clock/useRenderedSegments"
import { type Plan } from "../../../sequencing/plan/types"

export interface TimelineProps {
  plan: Plan
  playhead: Playhead
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`

/**
 * The plan as a strip, with the playhead over it.
 *
 * Worth reading before pressing play: the blocks are the planner's decisions
 * -- which tier it picked, what it gave each view, whether it had to overrun --
 * so a mistuned segment shows up here rather than having to be caught by eye
 * halfway through a run.
 */
export const Timeline = (props: TimelineProps) => {
  const { plan, playhead } = props

  const rendered = useRenderedSegments(playhead, plan)
  const playing = usePlayheadPlaying(playhead)
  const active = rendered[rendered.length - 1]

  const barRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)

  /*
   * The marker moves every frame, but only ever moves itself. Driving it
   * through state would re-render the whole strip sixty times a second to
   * shift one element, so it writes to its own node and leaves React to
   * re-render on the things that actually change: the segment, the plan.
   */
  useEffect(() => {
    let frame = requestAnimationFrame(function paint() {
      frame = requestAnimationFrame(paint)

      const t = playhead.now()

      if (markerRef.current)
        markerRef.current.style.left = `${Math.min(t / plan.total, 1) * 100}%`

      if (clockRef.current) clockRef.current.textContent = seconds(t)
    })

    return () => cancelAnimationFrame(frame)
  }, [playhead, plan.total])

  const seekTo = (clientX: number) => {
    const bar = barRef.current
    if (!bar) return

    const { left, width } = bar.getBoundingClientRect()
    playhead.seek(((clientX - left) / width) * plan.total)
  }

  const overrun = plan.total - plan.budget

  return (
    <div className="flex flex-col gap-2 font-mono text-[13px] text-[#ddd]">
      <div className="flex items-baseline gap-4">
        <span className="font-bold">{plan.tierName}</span>
        <span className="text-[#999]">
          budget {seconds(plan.budget)} → planned {seconds(plan.total)}
        </span>
        {overrun > 0 && (
          <span className="text-[#ff8c42]">overruns by {seconds(overrun)}</span>
        )}
        <span className="ml-auto flex gap-2">
          <span ref={clockRef}>0.0s</span>
          <span className="w-14 text-[#999]">{playing ? "" : "paused"}</span>
        </span>
      </div>

      <div
        ref={barRef}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          seekTo(event.clientX)
        }}
        onPointerMove={(event) => {
          // Only while dragging; a bare hover must not move the playhead.
          if (event.buttons & 1) seekTo(event.clientX)
        }}
        className="relative flex h-10 cursor-pointer touch-none select-none overflow-hidden rounded-sm bg-[#222]"
      >
        {plan.segments.map((segment, index) => (
          <div
            key={`${segment.spec.name}:${index}`}
            style={{ width: `${(segment.duration / plan.total) * 100}%` }}
            className={classNames(
              "flex min-w-0 flex-col justify-center overflow-hidden border-r border-[#111] px-2 leading-tight",
              index === active?.index
                ? "bg-[#3a6ea5] text-white"
                : "bg-[#444] text-[#bbb]",
            )}
          >
            <span className="truncate">{segment.spec.name}</span>
            <span className="truncate text-[11px] opacity-70">
              {seconds(segment.duration)}
            </span>
          </div>
        ))}

        <div
          ref={markerRef}
          className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-[#ff8c42]"
        />
      </div>
    </div>
  )
}
