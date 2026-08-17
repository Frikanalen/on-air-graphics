import classNames from "classnames"
import { Logo } from "./Logo"
import { type SegmentStatus } from "../../sequencing/plan/types"

export type IntroView = {
  status: SegmentStatus
}

export const IntroView = ({ status }: IntroView) => {
  return (
    <div>
      <div
        className={classNames(
          /*
           * The card colour and shadow without `card`'s own backdrop-filter:
           * this sheet is the whole frame, so its frost comes from the segment's
           * `blurBackground` instead -- see SegmentSpec for why a full-frame
           * panel must not blur a playing video by reading the backdrop back.
           */
          "absolute top-0 right-0 h-[200%] w-[200%] rounded-lg bg-card p-6 shadow-card",
          "[transform:rotate(10deg)_translateY(-220px)]",
          status === "entering" && "animate-card-appear",
          status === "exiting" && "animate-card-fall",
        )}
      />
      <div className="absolute inset-0 z-100 flex items-center justify-center text-normal">
        <div
          className={classNames(
            "relative z-1 w-[600px]",
            status === "entering" && "animate-logo-unblur",
            status === "exiting" && "animate-logo-fall",
          )}
        >
          <Logo />
        </div>
      </div>
    </div>
  )
}
