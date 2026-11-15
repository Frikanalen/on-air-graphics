import { FRAME_MS } from "../graphics/time"
import { posterSlides, slideSeconds } from "../core/posterSlides"
import { type Bulletin } from "./types"

/**
 * How a bulletin airs on the cream slate between programmes. Its text is
 * paged by the rule text posters use (posterSlides.ts), and it is given the
 * time it takes to read every page once: a bulletin either airs whole or
 * waits for a longer gap.
 */

/** The 1.8 s blade movement and the 0.5 s fade the text comes up with. */
export const SLATE_ENTRANCE_MS = 2300
/** A page fades out, then the next fades in: two texts never overlap. */
export const SLATE_PAGE_FADE_MS = 300
/** However many bulletins are running, a gap airs at most this many. */
export const MAX_SLATES = 3
/** How often the turn passes to the next bulletin of the same priority. */
export const TURN_MS = 5 * 60000

export const slatePages = (bulletin: Bulletin) => posterSlides(bulletin.text)

/** How long each page is held, rounded up to whole frames. */
export const slatePageMs = (bulletin: Bulletin): number[] =>
  slideSeconds(bulletin.heading, bulletin.text).map(
    (seconds) => Math.ceil(Math.round(seconds * 1000) / FRAME_MS) * FRAME_MS,
  )

export const slateMs = (bulletin: Bulletin): number =>
  SLATE_ENTRANCE_MS + slatePageMs(bulletin).reduce((sum, ms) => sum + ms, 0)

const clamp = (x: number) => Math.max(0, Math.min(1, x))

/**
 * Which page shows `elapsed` ms into a slate, and how opaque it is. The first
 * page comes up with the slate and the last leaves with it, so neither fades
 * here.
 */
export function slatePageAt(
  pageMs: readonly number[],
  elapsed: number,
): { index: number; opacity: number } {
  let start = SLATE_ENTRANCE_MS
  for (const [index, ms] of pageMs.entries()) {
    const end = start + ms
    const last = index === pageMs.length - 1
    if (elapsed < end || last) {
      const fadeIn =
        index === 0 ? 1 : clamp((elapsed - start) / SLATE_PAGE_FADE_MS)
      const fadeOut = last ? 1 : clamp((end - elapsed) / SLATE_PAGE_FADE_MS)
      return { index, opacity: Math.min(fadeIn, fadeOut) }
    }
    start = end
  }
  return { index: 0, opacity: 1 }
}

/**
 * The order bulletins air in. The API lists the highest priority first, and
 * that is kept; bulletins of the same priority take turns at going first, a
 * new one every TURN_MS, so a short gap does not always show the same one.
 */
export function inTurn(bulletins: Bulletin[], now: number): Bulletin[] {
  const turn = Math.floor(now / TURN_MS)
  const groups = new Map<number, Bulletin[]>()
  for (const bulletin of bulletins) {
    const priority = bulletin.priority ?? 0
    groups.set(priority, [...(groups.get(priority) ?? []), bulletin])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .flatMap(([, group]) => {
      const first = turn % group.length
      return [...group.slice(first), ...group.slice(0, first)]
    })
}

/** `?view=slate&heading=…&text=…&template=…` previews a bulletin that is
 * not saved yet, as the editor does. */
export function bulletinFromQuery(
  search = window.location.search,
): Bulletin | null {
  const query = new URLSearchParams(search)
  if (!query.has("heading") && !query.has("text")) return null
  return {
    id: "preview",
    heading: query.get("heading") ?? "",
    text: query.get("text") ?? "",
    template: query.get("template") ?? "standard",
  }
}

/** Shown by `?view=slate` when there is nothing else to show. */
export const SAMPLE_BULLETIN: Bulletin = {
  id: "sample",
  heading: "Melding fra Frikanalen",
  text: "Her vises meldinger fra kanalen mellom programmene. En lang melding deles på flere sider, og hver side står så lenge det tar å lese den.\n\nMeldingene skrives i Studio.",
  template: "standard",
}
