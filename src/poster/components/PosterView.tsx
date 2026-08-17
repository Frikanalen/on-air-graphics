import classNames from "classnames"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { useParams } from "../../core/hooks/useParams"
import { SVGIcon } from "../../core/components/SVGIcon"
import { POSTER_TYPES } from "../constants"

export interface PosterViewProps {
  transition: SegmentStatus
}

export function PosterView(props: PosterViewProps) {
  const { transition } = props

  const { message, type } = useParams({
    message: "Tekstplakat melding",
    type: "info",
  })

  const safeType = POSTER_TYPES.find((t) => t === type) ?? "info"

  return (
    <div className="flex h-full items-end justify-center p-16">
      <div
        className={classNames(
          "flex items-center justify-center",
          transition === "exiting" ? "animate-poster-out" : "animate-poster-in",
          safeType !== "info" ? "text-warning" : "text-normal",
          "card relative z-2 p-8",
        )}
      >
        <SVGIcon name={safeType} className="mr-4 h-10.5 w-10.5" />
        <span className="text-lead font-medium">{message}</span>
      </div>
    </div>
  )
}
