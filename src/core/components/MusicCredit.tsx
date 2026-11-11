import classNames from "classnames"

/**
 * Playout loops this track under the graphics. CC BY 4.0 asks for the title,
 * author, source and the licence with its URI, in any reasonable manner for
 * the medium -- this is all of that and no more.
 */
export const MUSIC_CREDIT =
  "Musikk: \u00abDeep Relaxation\u00bb Kevin MacLeod (incompetech.com), CC BY 4.0 creativecommons.org/licenses/by/4.0"

export interface MusicCreditProps {
  /** Set on a light background; the Player toggles it per frame instead. */
  light?: boolean
}

/** Sits on the line above the disclaimer, in every view. */
export function MusicCredit({ light }: MusicCreditProps) {
  return (
    <div className={classNames("music-credit", { "on-light": light })}>
      {MUSIC_CREDIT}
    </div>
  )
}
