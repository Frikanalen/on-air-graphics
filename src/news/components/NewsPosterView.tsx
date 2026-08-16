import classNames from "classnames"
import { Logo } from "../../core/components/Logo"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { type NewsBulletin } from "../types"

export interface NewsPosterViewProps {
  status: SegmentStatus
  bulletin: NewsBulletin
}

/**
 * One piece of channel news, filling time that would otherwise be dead. It
 * borrows the text poster's rise-from-the-bottom so the two read as the same
 * kind of announcement.
 */
export function NewsPosterView(props: NewsPosterViewProps) {
  const { status, bulletin } = props
  const exiting = status === "exiting"

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 p-16">
      <Logo
        className={classNames(
          "w-[360px] text-normal",
          exiting ? "animate-slide-fade-out" : "animate-slide-fade-in",
        )}
      />

      <div
        className={classNames(
          "card relative z-2 max-w-[820px] p-8",
          exiting ? "animate-poster-out" : "animate-poster-in",
        )}
      >
        <h2 className="text-lead font-medium text-normal">{bulletin.title}</h2>
        {/* leading-snug because text-body's 0.75 laps wrapped lines. */}
        <p className="mt-3 text-body leading-snug text-muted">
          {bulletin.body}
        </p>
      </div>
    </div>
  )
}
