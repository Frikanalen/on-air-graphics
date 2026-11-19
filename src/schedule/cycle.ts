/**
 * How the schedule view spends its time. With only a few seconds it shows the
 * overview: the next programme and the ones straight after it. With more, it
 * turns pages: the overview, the rest of the day's schedule a page at a time,
 * then the next programme on its own with its description. It goes round in
 * whole cycles, so it always ends on the next programme, the last thing a
 * viewer sees before that programme starts.
 *
 * When the view has a handover page (the gap ends where another holder's
 * airtime starts), that page takes the place of the last one: the gap ends on
 * whose airtime is about to begin.
 */
export const SCHEDULE_PAGE_KINDS = [
  "overview",
  "list",
  "focus",
  "handover",
] as const
export type SchedulePageKind = (typeof SCHEDULE_PAGE_KINDS)[number]

/** How long each kind of page is held before the cycle is stretched to fit. */
export const SCHEDULE_PAGE_MS: Record<SchedulePageKind, number> = {
  overview: 12000,
  list: 9000,
  focus: 10000,
  handover: 10000,
}
/** A page fades out, then the next fades in: two texts never overlap. */
export const SCHEDULE_PAGE_FADE_MS = 300

/** Programmes on the overview, and on each page of the rest of the day. */
export const OVERVIEW_ROWS = 4
export const LIST_ROWS = 7
export const MAX_LIST_PAGES = 3
/** The rest of the day's schedule reaches this far ahead. */
export const LIST_HORIZON_MS = 18 * 3600000

const clamp = (x: number) => Math.max(0, Math.min(1, x))

/**
 * The pages one cycle shows, as indices into `kinds`, which lists the pages
 * in the order the view renders them. Pages of the later schedule are left
 * out from the end until one cycle fits; without both an overview and a focus
 * page, or without time for both, the first page is held throughout.
 */
export function cyclePages(
  kinds: readonly SchedulePageKind[],
  duration: number,
): number[] {
  const overview = kinds.indexOf("overview")
  const focus = kinds.indexOf("focus")
  const length = (pages: number[]) =>
    pages.reduce((sum, page) => sum + SCHEDULE_PAGE_MS[kinds[page]], 0)
  if (overview < 0 || focus < 0 || length([overview, focus]) > duration)
    return kinds.length ? [0] : []
  const lists = kinds.flatMap((kind, index) => (kind === "list" ? [index] : []))
  while (lists.length && length([overview, ...lists, focus]) > duration)
    lists.pop()
  return [overview, ...lists, focus]
}

/**
 * Which page shows `elapsed` ms into a schedule view given `duration` ms, and
 * how opaque it is. The first page does not fade in and the last does not fade
 * out: the view's own entrance and exit do that.
 */
export function schedulePageAt(
  kinds: readonly SchedulePageKind[],
  duration: number,
  elapsed: number,
): { index: number; opacity: number } {
  const pages = cyclePages(kinds, duration)
  const handover = kinds.indexOf("handover")
  // Without time to turn pages, the handover is the page worth the time.
  if (pages.length <= 1)
    return { index: handover >= 0 ? handover : (pages[0] ?? 0), opacity: 1 }
  const holds = pages.map((page) => SCHEDULE_PAGE_MS[kinds[page]])
  const once = holds.reduce((a, b) => a + b, 0)
  const cycles = Math.max(1, Math.floor(duration / once))
  // Each cycle is stretched by the same factor, so the cycles fill the time.
  const stretch = duration / (cycles * once)
  const t = Math.max(0, Math.min(elapsed, duration - 1))
  const cycle = Math.floor(t / (once * stretch))
  let start = cycle * once * stretch
  for (const [position, hold] of holds.entries()) {
    const end = start + hold * stretch
    if (t < end || position === holds.length - 1) {
      const fadeIn = start <= 0 ? 1 : clamp((t - start) / SCHEDULE_PAGE_FADE_MS)
      const fadeOut =
        end >= duration ? 1 : clamp((end - t) / SCHEDULE_PAGE_FADE_MS)
      const closing =
        handover >= 0 && cycle >= cycles - 1 && position === holds.length - 1
      return {
        index: closing ? handover : pages[position],
        opacity: Math.min(fadeIn, fadeOut),
      }
    }
    start = end
  }
  return { index: pages[pages.length - 1], opacity: 1 }
}

/** `?page=<index or kind>` holds one page, for review and the visual tests. */
export function heldSchedulePage(
  kinds: readonly SchedulePageKind[],
  search = window.location.search,
): number | null {
  const value = new URLSearchParams(search).get("page")
  if (value === null) return null
  const byKind = kinds.indexOf(value as SchedulePageKind)
  if (byKind >= 0) return byKind
  const index = Number.parseInt(value, 10)
  return Number.isInteger(index) && index >= 0 && index < kinds.length
    ? index
    : null
}
