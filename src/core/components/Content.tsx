import { TransitionGroup } from "react-transition-group"
import { RESOLUTION, SEQUENCE_NAMES } from "../constants"
import { useParams } from "../hooks/useParams"
import { PosterView } from "../../poster/components/PosterView"
import {
  type SequenceEntry,
  ViewSequence,
} from "../../sequencing/components/ViewSequence"
import { getIntermissionSequence } from "../../schedule/helpers/getIntermissionSequence"

const [width, height] = RESOLUTION

export function Content() {
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
      {/*
       * Nothing here may fade the views as a group. An ancestor at opacity < 1
       * is a backdrop root, which cuts the cards' backdrop-filter off from what
       * it is meant to blur and flattens them for the length of the fade. Each
       * view carries its own entrance and exit instead.
       */}
      <TransitionGroup className="absolute top-0 left-0 h-full w-full">
        {sequenceName === "poster" ? (
          <ViewSequence sequence={[posterEntry]} />
        ) : (
          <ViewSequence sequence={getIntermissionSequence()} />
        )}
      </TransitionGroup>
    </div>
  )
}
