import { CHANNEL_DISCLAIMER } from "../constants"

/**
 * Holds the disclaimer's height open without drawing it.
 *
 * Only the schedule view says it out loud, but every view that shows alongside
 * the station clock has to end where the schedule's content ends -- otherwise a
 * card that fills the column would run lower than the schedule's cards do, and
 * the clock would sit at a different height depending on which view was up.
 */
export function DisclaimerSpace() {
  return (
    <div aria-hidden className="invisible text-footnote font-semibold">
      {CHANNEL_DISCLAIMER}
    </div>
  )
}
