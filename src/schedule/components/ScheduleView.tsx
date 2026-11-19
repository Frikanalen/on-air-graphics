import { useContext } from "react"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { CHANNEL_DISCLAIMER } from "../../core/constants"
import {
  GrantsContext,
  ScheduleContext,
} from "../../core/components/ScheduleContext"
import { formatTime, useTimestamp } from "../../graphics/time"
import { holderAt, upcoming, type Upcoming } from "../airtime"
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

/** Who holds the airtime the graphics are showing in, and until when. */
const Holder = ({ now }: { now: number }) => {
  const grant = holderAt(useContext(GrantsContext), now)
  if (!grant) return null
  return (
    <div className="airtime-holder">
      Sendetiden disponeres nå av{" "}
      {grant.organization.fkmember !== false && "vårt medlem "}
      <b>{grant.organization.name}</b> til{" "}
      {formatTime(Date.parse(grant.endtime))}
    </div>
  )
}

const Later = ({ entry }: { entry: Upcoming }) =>
  "airtime" in entry ? (
    <div className="later-row airtime-row">
      <time dateTime={entry.airtime.starttime}>
        {formatTime(Date.parse(entry.airtime.starttime))}
      </time>
      <div className="programme-info">
        <h2>Sendetid: {entry.airtime.organization.name}</h2>
        <div className="organisation">Programmet er ikke klart ennå</div>
      </div>
    </div>
  ) : (
    <ScheduleItemSummary item={entry} />
  )

const keyOf = (entry: Upcoming) =>
  "airtime" in entry ? `airtime-${entry.airtime.id}` : entry.id

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
  const grants = useContext(GrantsContext)
  const [next, ...programmes] = schedule.filter(
    (item): item is Programme =>
      item.video !== null && now < Date.parse(item.endtime),
  )
  const later = upcoming(
    programmes,
    schedule,
    grants,
    next ? Date.parse(next.starttime) : now,
  )
  const rest = later
    .slice(OVERVIEW_ROWS)
    .filter(
      (entry) =>
        Date.parse(
          "airtime" in entry ? entry.airtime.starttime : entry.starttime,
        ) <
        now + LIST_HORIZON_MS,
    )
  const lists = nextOnly ? [] : chunks(rest, LIST_ROWS).slice(0, MAX_LIST_PAGES)
  return (
    <div>
      {!nextOnly && (
        <div
          className="schedule-column schedule-page"
          data-kind="overview"
          style={{ opacity: 1 }}
        >
          <Holder now={now} />
          <div className="label amber">Neste program</div>
          {next ? (
            <ScheduleItemSummary item={next} next />
          ) : (
            <div className="next-empty">Programoversikten oppdateres</div>
          )}
          <Tricolour />
          <div className="label later-label">Senere</div>
          <div className="later-list">
            {later.slice(0, OVERVIEW_ROWS).map((entry) => (
              <Later key={keyOf(entry)} entry={entry} />
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
            {items.map((entry) => (
              <Later key={keyOf(entry)} entry={entry} />
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
          <Holder now={now} />
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
