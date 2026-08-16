import classNames from "classnames"
import { TransitionStatus } from "react-transition-group"
import { Logo } from "./Logo"
import { SequenceEntry } from "../../sequencing/components/ViewSequence"

const ENTER_MS = 1200

export const INTRO_VIEW_SEQUENCE_ENTRY: SequenceEntry = {
  name: "intro",
  duration: ENTER_MS + 2000,
  render: (status) => <IntroView status={status} />,
  overlay: false,
}

export type IntroView = {
  status: TransitionStatus
}

export const IntroView = ({ status }: IntroView) => {
  return (
    <div>
      <div
        className={classNames(
          "card absolute top-0 right-0 h-[200%] w-[200%] p-6",
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
