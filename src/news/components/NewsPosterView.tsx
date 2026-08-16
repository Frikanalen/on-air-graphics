import classNames from "classnames"
import { DisclaimerSpace } from "../../core/components/DisclaimerSpace"
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
      <div className="relative z-10 flex flex-1">
        <div className="flex max-w-[590px] flex-1 flex-col">
          <div
            className={classNames(
              "card flex flex-1 flex-col p-6",
              exiting ? "animate-schedule-out" : "animate-schedule-in",
            )}
          >
            <h2 className="text-lead leading-snug font-medium text-normal">
              {bulletin.title}
            </h2>
            {/* leading-snug because text-body's 0.75 laps wrapped lines. */}
            <p className="mt-3 text-body leading-snug text-muted">
              {bulletin.body}
            </p>
          </div>
        </div>
      </div>

      <DisclaimerSpace />
    </div>
  )
}
