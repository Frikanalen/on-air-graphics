import { Clock } from "./Clock"
import { DisclaimerSpace } from "./DisclaimerSpace"
import { Logo } from "./Logo"

/**
 * The station clock: the dial and the channel's mark, which read as one piece
 * of design and belong to no single view.
 *
 * The Player renders it once and leaves it mounted for as long as the segments
 * ask for it, which is the whole point -- a clock that unmounts at every
 * handover would fade out and start its entrance again, and a clock that
 * restarts twice a minute reads as a slideshow rather than as the time. It
 * animates in when it first appears and then simply stays, while the views
 * change underneath it.
 */
export function StationClock() {
  return (
    <div className="pointer-events-none absolute inset-0 flex h-full animate-slide-fade-in flex-col p-16">
      <div className="flex flex-1">
        {/* Mirrors the content column, so the mark keeps its place. */}
        <div className="max-w-[590px] flex-1" />

        <div className="flex flex-1 flex-col items-center">
          <Logo className="w-[450px] text-normal" />
          <div className="flex flex-1 items-center">
            <Clock size={320} />
          </div>
        </div>
      </div>

      <DisclaimerSpace />
    </div>
  )
}
