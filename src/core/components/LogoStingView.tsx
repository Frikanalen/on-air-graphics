import classNames from "classnames"
import { Logo } from "./Logo"
import { type SegmentStatus } from "../../sequencing/plan/types"

export interface LogoStingViewProps {
  status: SegmentStatus
}

/**
 * The whole programme when there is barely any time: the channel's mark, and
 * nothing else. It keeps the intro's unblur, so a five second slot still looks
 * like the front of a longer one rather than a different channel.
 */
export function LogoStingView(props: LogoStingViewProps) {
  const { status } = props

  return (
    <div className="absolute inset-0 flex items-center justify-center text-normal">
      <div
        className={classNames(
          "w-[600px]",
          status === "entering" && "animate-logo-unblur",
          status === "exiting" && "animate-slide-fade-out",
        )}
      >
        <Logo />
      </div>
    </div>
  )
}
