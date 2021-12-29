import React, { useContext } from "react"
import styled from "@emotion/styled"
import { FADE_TRANSITION_MS, RESOLUTION, SEQUENCE_NAMES } from "../constants"
import { App } from "./App"
import { Background } from "./Background"
import { useParams } from "../hooks/useParams"
import { PosterView } from "../../poster/components/PosterView"
import { TransitionGroup } from "react-transition-group"
import {
  SequenceEntry,
  ViewSequence,
} from "../../sequencing/components/ViewSequence"
import { getIntermissionSequence } from "../../schedule/helpers/getIntermissionSequence"

const [width, height] = RESOLUTION

const Container = styled.div`
  width: ${width}px;
  height: ${height}px;

  position: relative;
  overflow: hidden;

  background: transparent;
`

const Inner = styled.div<{ visible: boolean }>`
  transition: opacity ${FADE_TRANSITION_MS}ms ease-in-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`

const View = styled(TransitionGroup)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`

export function Content() {
  const app = useContext(App.context)

  const { sequence } = useParams({
    sequence: "default",
  })

  const sequenceName = SEQUENCE_NAMES.find((s) => s === sequence) ?? "default"

  const renderView = () => {
    if (sequenceName === "poster") {
      const entry: SequenceEntry = {
        name: "poster",
        duration: Infinity,
        render: (status) => <PosterView transition={status} />,
      }

      return <ViewSequence sequence={[entry]} />
    }

    return <ViewSequence sequence={getIntermissionSequence(app.duration)} />
  }

  const renderBackground = () => {
    if (app.keyed) return null
    return <Background />
  }

  return (
    <Container>
      <Inner visible={app.state === "active"}>
        {renderBackground()}
        <View>{renderView()}</View>
      </Inner>
    </Container>
  )
}
