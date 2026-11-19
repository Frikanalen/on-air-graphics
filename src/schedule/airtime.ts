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
