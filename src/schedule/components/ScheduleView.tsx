import classNames from "classnames"
import { TransitionStatus } from "react-transition-group"
import { Clock } from "../../core/components/Clock"
import { Logo } from "../../core/components/Logo"
import { ScheduleItemSummary } from "./ScheduleItemSummary"
import { useSchedule } from "../../core/useSchedule"

export type ScheduleViewProps = {
  status: TransitionStatus
}

export function ScheduleView(props: ScheduleViewProps) {
  const { schedule } = useSchedule()

  const { status } = props
  const exiting = status === "exiting"

  const [next, ...scheduleItems] =
    schedule?.filter((x) => new Date() < new Date(x.endtime)) ?? []

  const title = classNames(
    "text-normal [transition:all_500ms_ease]",
    exiting ? "animate-title-out" : "animate-title-in",
  )
  const card = classNames(
    "card p-6",
    exiting ? "animate-schedule-out" : "animate-schedule-in",
  )
  const slide = exiting ? "animate-slide-fade-out" : "animate-slide-fade-in"

  return (
    <div
      className={classNames(
        "flex h-full flex-col p-16",
        // Decorative panel behind the schedule, only visible as a solid
        // colour where backdrop-filter is unsupported.
        "before:absolute before:top-0 before:right-0 before:h-[140%] before:w-[65%] before:content-['']",
        "before:[transform:rotate(10deg)_translateY(-90px)_translateX(70px)]",
        "not-supports-[backdrop-filter:blur(30px)]:before:bg-[var(--fk-color-backdrop-fallback)]",
        exiting ? "before:animate-container-out" : "before:animate-container-in",
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
        <div className="flex flex-1 flex-col items-center">
          <Logo className={classNames("w-[450px] text-normal", slide)} />
          <div
            className={classNames(
              "flex flex-1 items-center [animation-delay:100ms]",
              slide,
            )}
          >
            <Clock size={320} />
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "relative z-1 text-center text-[16px] font-semibold text-muted",
          exiting ? "animate-footer-out" : "animate-footer-in",
        )}
      >
        Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
        kontakt- og redaktørinformasjon.
      </div>
    </div>
  )
}
