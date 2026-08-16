export const RESOLUTION = [1280, 720] as const

/**
 * Used when the playout system does not say how long it needs. Comfortably
 * clears the full intermission's threshold: falling back to something the
 * planner has to squeeze would make a missing parameter look like a bug in the
 * graphics.
 */
export const DEFAULT_BUDGET_MS = 30000

/** Drives the JS-side sequencing. Mirrored by --fk-fade-transition in index.css. */
export const FADE_TRANSITION_MS = 500

/**
 * Shown by the schedule view. The chrome reserves its height even where it is
 * not drawn, so the clock sits at the same point on the frame throughout.
 */
export const CHANNEL_DISCLAIMER =
  "Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for kontakt- og redaktørinformasjon."

export const SEQUENCE_NAMES = ["default", "poster"] as const

