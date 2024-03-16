import { SequencerPhase } from "./useSequencer.tsx"
import { SequencerComponentProps } from "../../views/types.ts"

export const getSequenceComponentProps = (
  pageIndex: number,
  currentPage: number,
  sequencerPhase: SequencerPhase,
): SequencerComponentProps => {
  if (currentPage !== pageIndex)
    return { sequencerCues: { transition: "unmounted" } }

  switch (sequencerPhase) {
    case "entered":
      return { sequencerCues: { transition: "entered" } }

    case "entering":
      return { sequencerCues: { transition: "entering" } }

    case "exiting":
      return { sequencerCues: { transition: "exiting" } }
  }
}
