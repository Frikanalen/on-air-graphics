import { formatTime } from "../graphics/time"
import { type Grant, type Programme, type ScheduleItem } from "./types"

/** The grant whose window `now` is in. */
export const holderAt = (grants: Grant[], now: number) =>
  grants.find(
    (grant) =>
      Date.parse(grant.starttime) <= now && now < Date.parse(grant.endtime),
  )

/** An entry of the later list: a programme, or airtime with none set up yet. */
export type Upcoming = Programme | { airtime: Grant }

const startOf = (entry: Upcoming) =>
  Date.parse("airtime" in entry ? entry.airtime.starttime : entry.starttime)

/**
 * The programmes after the next one, with the windows of airtime that start
 * after it and have no programme in the schedule yet, in air order.
 */
export function upcoming(
  later: Programme[],
  schedule: ScheduleItem[],
  grants: Grant[],
  after: number,
): Upcoming[] {
  const programmed = new Set(schedule.map((item) => item.grant))
  const open = grants.filter(
    (grant) => Date.parse(grant.starttime) > after && !programmed.has(grant.id),
  )
  return [...later, ...open.map((airtime) => ({ airtime }))].sort(
    (a, b) => startOf(a) - startOf(b),
  )
}

/**
 * The airtime the gap now on screen leads into, when it is someone else's
 * than the airtime the gap is in: the next programme is in a window that has
 * not started, held by another organization than the one holding this moment
 * (or by anyone, when nobody holds it). The station's own airtime is not
 * handed over to: it is the channel carrying on. A window opens with its first entry,
 * so the gap before that programme ends where the window starts.
 */
export function handoverTo(
  next: Programme | undefined,
  grants: Grant[],
  now: number,
): Grant | undefined {
  const grant = next && grants.find(({ id }) => id === next.grant)
  if (!grant || grant.station || Date.parse(grant.starttime) <= now)
    return undefined
  const holder = holderAt(grants, now)
  return holder?.organization.id === grant.organization.id ? undefined : grant
}

const HOURS = [
  "to",
  "tre",
  "fire",
  "fem",
  "seks",
  "sju",
  "åtte",
  "ni",
  "ti",
  "elleve",
  "tolv",
]

/**
 * How long a window of airtime is, as the subject of "… disponeres av": a
 * round length in words, any other by when it ends.
 */
export function stretchOf(grant: Grant): string {
  const end = Date.parse(grant.endtime)
  const minutes = (end - Date.parse(grant.starttime)) / 60000
  const hours = minutes / 60
  if (minutes === 30) return "Den neste halvtimen"
  if (minutes === 60) return "Den neste timen"
  if (Number.isInteger(hours) && hours >= 2 && hours <= 12)
    return `De neste ${HOURS[hours - 2]} timene`
  if (minutes >= 10 && minutes < 100 && minutes % 5 === 0)
    return `De neste ${minutes} minuttene`
  return `Sendetiden fram til ${formatTime(end)}`
}
