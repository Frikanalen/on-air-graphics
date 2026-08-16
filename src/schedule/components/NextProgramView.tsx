import { useContext } from "react"
import classNames from "classnames"
import { Logo } from "../../core/components/Logo"
import { ScheduleContext } from "../../core/components/ScheduleContext"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { ScheduleItemSummary } from "./ScheduleItemSummary"

export interface NextProgramViewProps {
  status: SegmentStatus
}

/**
 * The one thing worth saying when there is time for one thing: what is on
 * next. The full schedule needs room for four cards and a clock; this needs
 * room for a card.
 */
export function NextProgramView(props: NextProgramViewProps) {
  const { status } = props
  const exiting = status === "exiting"

  const schedule = useContext(ScheduleContext)
  const [next] = schedule.filter((item) => new Date() < new Date(item.endtime))

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 p-16">
      <Logo
        className={classNames(
          "w-[420px] text-normal",
          exiting ? "animate-slide-fade-out" : "animate-slide-fade-in",
        )}
      />

      <div className="w-[720px]">
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
  )
}
