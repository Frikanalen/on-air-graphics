import classNames from "classnames"

/**
 * Playout loops this track under the graphics. The licence (CC BY 4.0) asks
 * for the credit wherever it is heard, worded as the author gives it.
 */
export const MUSIC_CREDIT = [
  "“Deep Relaxation” Kevin MacLeod (incompetech.com)",
  "Licensed under Creative Commons: By Attribution 4.0 License",
  "http://creativecommons.org/licenses/by/4.0/",
] as const

export interface MusicCreditProps {
  /** Set on a light background; the Player toggles it per frame instead. */
  light?: boolean
}

export function MusicCredit({ light }: MusicCreditProps) {
  return (
    <div className={classNames("music-credit", { "on-light": light })}>
      {MUSIC_CREDIT.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  )
}
