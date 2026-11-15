import { useSyncExternalStore } from "react"

/**
 * What an editor wants its preview frame to show. The editor on the website
 * frames this page (`?view=slate` or `?poster=`) and posts the text as it is
 * typed, so the preview follows without being loaded again:
 *
 *   frame.contentWindow.postMessage(
 *     { type: "fk-preview", heading, text, template, slide, look, from },
 *     location.origin,
 *   )
 *
 * Only a page of the same origin is listened to. Fields left out keep what
 * the address gave.
 */
export interface PreviewText {
  heading?: string
  text?: string
  template?: string
  /** Which page to hold, from 0. */
  slide?: number
  /** Text posters only: "day" or "night". */
  look?: string
  /** Text posters only: the organization the poster is from. */
  from?: string
}

let current: PreviewText | null = null
const listeners = new Set<() => void>()

const text = (value: unknown) => (typeof value === "string" ? value : undefined)

/** The fields of a message that are of the right kind; null if it is not ours. */
export function previewFrom(data: unknown): PreviewText | null {
  if (typeof data !== "object" || data === null) return null
  const message = data as Record<string, unknown>
  if (message.type !== "fk-preview") return null
  return {
    heading: text(message.heading),
    text: text(message.text),
    template: text(message.template),
    slide:
      typeof message.slide === "number" && Number.isInteger(message.slide)
        ? Math.max(0, message.slide)
        : undefined,
    look: text(message.look),
    from: text(message.from),
  }
}

if (typeof window !== "undefined")
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return
    const preview = previewFrom(event.data)
    if (!preview) return
    current = preview
    for (const listener of listeners) listener()
  })

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** What the editor last posted, or null when nothing has been. */
export const usePreviewText = () =>
  useSyncExternalStore(subscribe, () => current)

const QUERY_SLIDE =
  typeof window === "undefined"
    ? NaN
    : Number.parseInt(
        new URLSearchParams(window.location.search).get("slide") ?? "",
        10,
      )

/** The page to hold: the editor's, else `?slide=<n>`, else null (pages turn). */
export const heldSlide = (): number | null =>
  current?.slide ??
  (Number.isInteger(QUERY_SLIDE) ? Math.max(0, QUERY_SLIDE) : null)

/**
 * Tell a page framing this one that it can post now. What it posted while
 * the graphics were loading was not heard.
 */
export function announceReady() {
  if (window.parent !== window)
    window.parent.postMessage(
      { type: "fk-preview-ready" },
      window.location.origin,
    )
}
