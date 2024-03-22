import { useSequencer } from "./useSequencer.tsx"
import { ScheduleView } from "../../views/ScheduleView.tsx"
import { IntroView } from "../../views/IntroView.tsx"
import { SequenceCue, SequencerComponentProps } from "../../views/types.ts"
import { FullsizeContainer } from "./FullsizeContainer.tsx"

export const Sequencer = () => {
  const cueList: SequenceCue[] = [
    {
      duration: 4000,
      render: ({ sequencerCues }) => (
        <IntroView key={"intro"} sequencerCues={sequencerCues} />
      ),
    },
    {
      render: ({ sequencerCues }: SequencerComponentProps) => (
        <ScheduleView key={"schedule"} sequencerCues={sequencerCues} />
      ),
    },
  ]

  const { render } = useSequencer(cueList)

  return <FullsizeContainer>{render}</FullsizeContainer>
}
