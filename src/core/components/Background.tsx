import classNames from "classnames"

/** Served from the station's own upload host, next to the DV/AVI master. */
const LOOP_URL = "https://upload.frikanalen.no/media/filler/FrikanalenLoop.mp4"

export interface BackgroundProps {
  /** Frost the loop itself, for a view that covers the frame. */
  blurred: boolean
}

/**
 * The channel's own background: a silent loop behind everything the player
 * draws, and what the schedule view's frosted cards blur.
 *
 * It carries no state of its own. Content mounts it inside the frame's fade
 * group, so it arrives and leaves with everything else; it stays mounted and
 * playing while the frame is clear, since a remount would cost a fresh fetch
 * and a first-frame stall on the next cue.
 *
 * `muted` is what clears the autoplay policy; the loop carries no audio track
 * to begin with.
 */
export function Background(props: BackgroundProps) {
  return (
    <video
      className={classNames(
        "absolute inset-0 h-full w-full object-cover",
        "transition-[filter,scale] duration-(--fk-fade-transition) ease-[ease]",
        /*
         * Blurring an element samples past its own edges, which for a video
         * filling the frame means sampling nothing and fading out at the
         * borders. The scale pushes those soft edges off-frame; object-cover
         * absorbs it by cropping a little harder.
         */
        props.blurred ? "scale-110 blur-[30px]" : "scale-100 blur-none",
      )}
      src={LOOP_URL}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}
