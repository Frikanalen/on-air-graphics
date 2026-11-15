import { useContext } from "react"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { CHANNEL_DISCLAIMER } from "../../core/constants"
import { ScheduleContext } from "../../core/components/ScheduleContext"
import { useTimestamp } from "../../graphics/time"
import {
  LIST_HORIZON_MS,
  LIST_ROWS,
  MAX_LIST_PAGES,
  OVERVIEW_ROWS,
} from "../cycle"
import { type Programme } from "../types"
import { ScheduleItemSummary } from "./ScheduleItemSummary"

export type ScheduleViewProps = { status: SegmentStatus; nextOnly?: boolean }

const Tricolour = () => (
  <div className="tricolour">
    <i />
    <i />
    <i />
  </div>
)

const chunks = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  )

/**
 * The pages the schedule turns through (cycle.ts decides when): the overview,
 * the rest of the day's schedule, then the next programme on its own. They
 * are all mounted, in that order, and the Player fades between them each
 * frame, as it does for the member message. `nextOnly` is the last page alone.
 */
export function ScheduleView({ nextOnly = false }: ScheduleViewProps) {
  const schedule = useContext(ScheduleContext),
    now = useTimestamp()
  const [next, ...later] = schedule.filter(
    (item): item is Programme =>
      item.video !== null && now < Date.parse(item.endtime),
  )
  const rest = later
    .slice(OVERVIEW_ROWS)
    .filter((item) => Date.parse(item.starttime) < now + LIST_HORIZON_MS)
  const lists = nextOnly ? [] : chunks(rest, LIST_ROWS).slice(0, MAX_LIST_PAGES)
  return (
    <div>
      {!nextOnly && (
        <div
          className="schedule-column schedule-page"
          data-kind="overview"
          style={{ opacity: 1 }}
        >
          <div className="label amber">Neste program</div>
          {next ? (
            <ScheduleItemSummary item={next} next />
          ) : (
            <div className="next-empty">Programoversikten oppdateres</div>
          )}
          <Tricolour />
          <div className="label later-label">Senere</div>
          <div className="later-list">
            {later.slice(0, OVERVIEW_ROWS).map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      {lists.map((items, index) => (
        <div
          className="schedule-column schedule-page"
          data-kind="list"
          key={index}
          style={{ opacity: 0 }}
        >
          <div className="label later-label list-label">
            <span>Senere i sendeplanen</span>
            {lists.length > 1 && (
              <span className="list-count">
                {index + 1} / {lists.length}
              </span>
            )}
          </div>
          <div className="later-list">
            {items.map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
      {next && (
        <div
          className="schedule-column schedule-page next-only"
          data-kind="focus"
          style={{ opacity: nextOnly ? 1 : 0 }}
        >
          <div className="label amber">
            Neste program
            {next.is_live && <span className="live-tag">Direkte</span>}
          </div>
          <ScheduleItemSummary item={next} next detailed />
          <Tricolour />
        </div>
      )}
      {nextOnly && !next && (
        <div className="schedule-column schedule-page" data-kind="overview">
          <div className="label amber">Neste program</div>
          <div className="next-empty">Programoversikten oppdateres</div>
          <Tricolour />
        </div>
      )}
      <div className="disclaimer">{CHANNEL_DISCLAIMER}</div>
    </div>
  )
}
