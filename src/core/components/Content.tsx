import { useContext } from "react"
import classNames from "classnames"
import { TransitionGroup } from "react-transition-group"
import { RESOLUTION, SEQUENCE_NAMES } from "../constants"
import { useParams } from "../hooks/useParams"
import { PosterView } from "../../poster/components/PosterView"
import {
  type SequenceEntry,
  ViewSequence,
} from "../../sequencing/components/ViewSequence"
import { getIntermissionSequence } from "../../schedule/helpers/getIntermissionSequence"
import { AppContext } from "./AppContext.tsx"

const [width, height] = RESOLUTION

export function Content() {
  const { state } = useContext(AppContext)

  const { sequence } = useParams({
    sequence: "default",
  })

  const sequenceName = SEQUENCE_NAMES.find((s) => s === sequence) ?? "default"
  const posterEntry: SequenceEntry = {
    name: "poster",
    duration: Infinity,
    render: (status) => <PosterView transition={status} />,
  }

  return (
    <div
      className="relative overflow-hidden bg-transparent text-normal"
      style={{ width, height }}
    >
      <div
        className={classNames(
          "[transition:opacity_500ms_ease-in-out]",
          state === "active" ? "opacity-100" : "opacity-0",
        )}
      >
        <TransitionGroup className="absolute top-0 left-0 h-full w-full">
          {sequenceName === "poster" ? (
            <ViewSequence sequence={[posterEntry]} />
          ) : (
            <ViewSequence sequence={getIntermissionSequence()} />
          )}
        </TransitionGroup>
      </div>
    </div>
  )
}
