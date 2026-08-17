import { useContext } from "react"
import classNames from "classnames"
import { ScheduleContext } from "../../core/components/ScheduleContext"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { ScheduleItemSummary } from "./ScheduleItemSummary"

export interface NextProgramViewProps {
  status: SegmentStatus
}

/**
 * The one thing worth saying when there is time for one thing: what is on
 * next. The full schedule needs room for four cards; this needs room for one.
 */
export function NextProgramView(props: NextProgramViewProps) {
  const { status } = props
  const exiting = status === "exiting"

  const schedule = useContext(ScheduleContext)
  const [next] = schedule.filter((item) => new Date() < new Date(item.endtime))

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
            Neste program
          </h1>
          <div
            className={classNames(
              "card mt-6 p-6",
              exiting ? "animate-schedule-out" : "animate-schedule-in",
            )}
          >
            {next ? <ScheduleItemSummary item={next} /> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
