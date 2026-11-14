import { useContext } from "react"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { CHANNEL_DISCLAIMER } from "../../core/constants"
import { ScheduleContext } from "../../core/components/ScheduleContext"
import { useTimestamp } from "../../graphics/time"
import { ScheduleItemSummary } from "./ScheduleItemSummary"
/** The most later programmes there is ever room for; CSS cuts the rest. */
const LATER_ROWS = 5
export type ScheduleViewProps = { status: SegmentStatus; nextOnly?: boolean }
export function ScheduleView({ nextOnly = false }: ScheduleViewProps) {
  const schedule = useContext(ScheduleContext),
    now = useTimestamp()
  const [next, ...later] = schedule.filter(
    (item) => now < Date.parse(item.endtime),
  )
  return (
    <div>
      <div
        className={nextOnly ? "schedule-column next-only" : "schedule-column"}
      >
        <div className="label amber">Neste program</div>
        {next ? (
          <ScheduleItemSummary item={next} next />
        ) : (
          <div className="next-empty">Programoversikten oppdateres</div>
        )}
        <div className="tricolour">
          <i />
          <i />
          <i />
        </div>
        {!nextOnly && (
          <>
            <div className="label later-label">Senere</div>
            <div className="later-list">
              {later.slice(0, LATER_ROWS).map((item) => (
                <ScheduleItemSummary key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="disclaimer">{CHANNEL_DISCLAIMER}</div>
    </div>
  )
}
