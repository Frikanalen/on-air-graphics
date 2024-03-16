import stylex from "@stylexjs/stylex"
import { RESOLUTION, theme } from "../../theme.stylex.ts"
import { useSequencer } from "./useSequencer.tsx"
import { ScheduleView } from "../../views/ScheduleView.tsx"
import { IntroView } from "../../views/IntroView.tsx"
import { SequenceCue, SequencerComponentProps } from "../../views/types.ts"

const styles = stylex.create({
  container: {
    position: "relative",
    overflow: "hidden",
    background: "transparent",
  },
  inner: {
    transition: theme.transition,
    opacity: 1,
  },
  transparent: { opacity: 0 },
  view: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
})

const [width, height] = RESOLUTION

export const FullsizeContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div {...stylex.props(styles.container)} style={{ width, height }}>
      <div {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.view)}>{children}</div>
      </div>
    </div>
  )
}

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
