import { useContext } from "react"
import classNames from "classnames"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { CHANNEL_DISCLAIMER } from "../../core/constants"
import { ScheduleItemSummary } from "./ScheduleItemSummary"
import { ScheduleContext } from "../../core/components/ScheduleContext"

export type ScheduleViewProps = {
  status: SegmentStatus
}

export function ScheduleView(props: ScheduleViewProps) {
  const schedule = useContext(ScheduleContext)

  const { status } = props
  const exiting = status === "exiting"

  const [next, ...scheduleItems] = schedule.filter(
    (x) => new Date() < new Date(x.endtime),
  )

  const title = classNames(
    "text-normal",
    exiting ? "animate-title-out" : "animate-title-in",
  )
  const card = classNames(
    "card p-6",
    exiting ? "animate-schedule-out" : "animate-schedule-in",
  )
  return (
    <div
      className={classNames(
        "flex h-full flex-col p-16",
        // Decorative panel behind the schedule, only visible as a solid
        // colour where backdrop-filter is unsupported.
        "before:absolute before:top-0 before:right-0 before:h-[140%] before:w-[65%] before:content-['']",
        "before:[transform:rotate(10deg)_translateY(-90px)_translateX(70px)]",
        "not-supports-[backdrop-filter:blur(30px)]:before:bg-[var(--fk-color-backdrop-fallback)]",
        exiting
          ? "before:animate-container-out"
          : "before:animate-container-in",
      )}
    >
      <div className="relative z-10 flex flex-1">
        <div className="max-w-[590px] flex-1">
          <h1 className={title}>Neste program</h1>
          <div className={classNames(card, "mt-6 mb-[42px]")}>
            {next ? <ScheduleItemSummary item={next} /> : null}
          </div>
          <h1 className={title}>Senere</h1>
          <div
            className={classNames(
              card,
              "mt-6 flex flex-col gap-8 [animation-delay:100ms]",
            )}
          >
            {scheduleItems.slice(0, 3).map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
        {/* The station clock is drawn separately; it outlives this view. */}
      </div>
      <div
        className={classNames(
          "relative z-1 text-center text-footnote font-semibold text-muted",
          exiting ? "animate-footer-out" : "animate-footer-in",
        )}
      >
        {CHANNEL_DISCLAIMER}
      </div>
    </div>
  )
}
