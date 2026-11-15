import { useLayoutEffect, useRef } from "react"
import { Logo } from "../core/components/Logo"
import { type SegmentStatus } from "../sequencing/plan/types"
import { slatePageMs, slatePages } from "./slate"
import { type Bulletin } from "./types"

export interface BulletinSlateViewProps {
  status: SegmentStatus
  bulletin: Bulletin
}

/** The lowest a page may reach on the 720-line stage: clear of the footer. */
const FLOOR = 624
/** Type sizes to try, largest first, as a share of the designed size. */
const SCALES = [1, 0.92, 0.85, 0.78, 0.72, 0.66]

/**
 * Set the largest type at which every page clears the footer. One size for
 * the whole bulletin, so the text does not jump between pages. Measured
 * rather than estimated, because how many lines a text takes depends on its
 * words.
 */
function fit(slate: HTMLElement) {
  const pages = [...slate.querySelectorAll<HTMLElement>(".slate-page")]
  for (const scale of SCALES) {
    slate.style.setProperty("--slate-scale", String(scale))
    if (pages.every((page) => page.offsetTop + page.offsetHeight <= FLOOR))
      return
  }
}

/**
 * A bulletin on the cream slate. Every page is mounted, and the Player fades
 * between them each frame from `data-page-ms` (slate.ts), so a page turn
 * follows the playhead and can be scrubbed.
 */
export function BulletinSlateView({
  status,
  bulletin,
}: BulletinSlateViewProps) {
  const pages = slatePages(bulletin)
  const slate = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = slate.current
    if (!el) return
    fit(el)
    // Again once the typeface is in: it changes where lines break.
    let current = true
    void document.fonts.ready.then(() => current && fit(el))
    return () => {
      current = false
    }
  }, [bulletin.heading, bulletin.text, bulletin.template])
  return (
    <div
      className="org-slate"
      data-status={status}
      data-template={bulletin.template === "notice" ? "notice" : "standard"}
      ref={slate}
      data-page-ms={slatePageMs(bulletin).join(",")}
    >
      <Logo wordmarkOnly className="slate-wordmark" />
      {pages.map((page, index) => (
        <div
          className="slate-copy slate-page"
          data-page={index}
          key={index}
          style={{ opacity: index === 0 ? 1 : 0 }}
        >
          {bulletin.template === "notice" && (
            <div className="label slate-label">Viktig melding</div>
          )}
          <h1>{bulletin.heading}</h1>
          {page
            .split(/\n+/)
            .filter((line) => line.trim())
            .map((line, at) => (
              <p key={at}>{line}</p>
            ))}
          {pages.length > 1 && (
            <div className="slate-page-number">
              {index + 1} / {pages.length}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
