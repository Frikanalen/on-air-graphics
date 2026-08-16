import classNames from "classnames"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { type NewsBulletin } from "../types"

export interface NewsPosterViewProps {
  status: SegmentStatus
  bulletin: NewsBulletin
}

/**
 * One piece of channel news, filling time that would otherwise be dead.
 *
 * Shares the schedule's column and its card treatment so the two read as the
 * same programme rather than as an interruption -- the mark and the clock
 * carry on unchanged in the chrome to the right.
 */
export function NewsPosterView(props: NewsPosterViewProps) {
  const { status, bulletin } = props
  const exiting = status === "exiting"

  return (
    <div className="flex h-full flex-col p-16">
      <div className="relative z-10 flex flex-1 items-center">
        <div className="max-w-[590px] flex-1">
          <h1
            className={classNames(
              "text-normal",
              exiting ? "animate-title-out" : "animate-title-in",
            )}
          >
            Nytt fra Frikanalen
          </h1>

          <div
            className={classNames(
              "card mt-6 p-6",
              exiting ? "animate-schedule-out" : "animate-schedule-in",
            )}
          >
            <h2 className="ellipsis-heading text-normal">{bulletin.title}</h2>
            {/* leading-snug because text-body's 0.75 laps wrapped lines. */}
            <p className="mt-2 text-body leading-snug text-muted">
              {bulletin.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
