import { useContext } from "react"
import classNames from "classnames"
import { type TransitionStatus } from "react-transition-group"
import { useParams } from "../../core/hooks/useParams"
import { SVGIcon } from "../../core/components/SVGIcon"
import { POSTER_TYPES } from "../constants"
import { AppContext } from "../../core/components/AppContext.tsx"

export interface PosterViewProps {
  transition: TransitionStatus
}

export function PosterView(props: PosterViewProps) {
  const { transition } = props
  const app = useContext(AppContext)

  const { message, type } = useParams({
    message: "Tekstplakat melding",
    type: "info",
  })

  const safeType = POSTER_TYPES.find((t) => t === type) ?? "info"

  return (
    <div className="flex h-full items-end justify-center p-16">
      <div
        className={classNames(
          "card flex items-center justify-center",
          transition === "exiting" ? "animate-poster-out" : "animate-poster-in",
          safeType !== "info"
            ? "text-warning"
            : app.keyed
              ? "text-overlay"
              : "text-normal",
          app.keyed
            ? "p-6 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)]"
            : "relative z-2 rounded-lg p-8",
        )}
      >
        <SVGIcon name={safeType} className="mr-4 h-10.5 w-10.5" />
        <span className="text-lead font-medium">{message}</span>
      </div>
    </div>
  )
}
