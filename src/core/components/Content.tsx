import { useContext } from "react"
import styled from "@emotion/styled"
import { TransitionGroup } from "react-transition-group"
import { FADE_TRANSITION_MS, RESOLUTION, SEQUENCE_NAMES } from "../constants"
import { Background } from "./Background"
import { useParams } from "../hooks/useParams"
import { PosterView } from "../../poster/components/PosterView"
import {
  type SequenceEntry,
  ViewSequence,
} from "../../sequencing/components/ViewSequence"
import { getIntermissionSequence } from "../../schedule/helpers/getIntermissionSequence"
import { AppContext } from "./AppContext.tsx"

const [width, height] = RESOLUTION

const Container = styled.div<{ keyed: boolean }>`
  width: ${width}px;
  height: ${height}px;

  position: relative;
  overflow: hidden;

  background: ${({ keyed }) => (keyed ? "transparent" : "black")};
`

const Inner = styled.div<{ visible: boolean }>`
  transition: opacity ${FADE_TRANSITION_MS}ms ease-in-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`

const View = styled(TransitionGroup)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export function Content() {
  const { keyed, state } = useContext(AppContext)

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
    <Container keyed={keyed}>
      <Inner visible={state === "active"}>
        {!keyed && <Background />}
        <View>
          {sequenceName === "poster" ? (
            <ViewSequence sequence={[posterEntry]} />
          ) : (
            <ViewSequence sequence={getIntermissionSequence()} />
          )}
        </View>
      </Inner>
    </Container>
  )
}
