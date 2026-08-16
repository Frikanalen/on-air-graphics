import { CHANNEL_DISCLAIMER } from "../constants"
import { Clock } from "./Clock"
import { Logo } from "./Logo"

/**
 * The parts of the frame that belong to no single view: the mark and the
 * clock.
 *
 * The Player renders this once and leaves it mounted for as long as the
 * segments ask for it, which is the whole point -- a clock that unmounts at
 * every handover would fade out and start its entrance again, and a clock that
 * restarts twice a minute reads as a slideshow rather than as the time. It
 * animates in when it first appears and then simply stays, while the views
 * change underneath it.
 */
export function IntermissionChrome() {
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

      {/*
       * Reserves the disclaimer's height rather than drawing it: only the
       * schedule view says it, but the clock has to sit at the same height
       * whether the current view does or not.
       */}
      <div aria-hidden className="invisible text-footnote font-semibold">
        {CHANNEL_DISCLAIMER}
      </div>
    </div>
  )
}
