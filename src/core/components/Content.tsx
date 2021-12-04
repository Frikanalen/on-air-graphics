import React, { useContext, useEffect, useState } from "react"
import styled from "@emotion/styled"
import {
  FADE_TRANSITION_MS,
  RESOLUTION,
  VIEW_TRANSITION_MS,
  VIEW_TYPES,
} from "../constants"
import { App } from "./App"
import { Background } from "./Background"
import { useParams } from "../hooks/useParams"
import { PosterView } from "../../poster/components/PosterView"
import { Transition, TransitionGroup } from "react-transition-group"
import { delay } from "../helpers/delay"

const [width, height] = RESOLUTION

const Container = styled.div<{ keyed: boolean }>`
  width: ${width}px;
  height: ${height}px;

  position: relative;
  overflow: hidden;

  border: solid 2px ${(props) => props.theme.color.accent};
  margin-top: -2px;
  margin-left: -2px;

  background: ${(props) => (props.keyed ? "transparent" : "black")};
`

const Inner = styled.div<{ visible: boolean }>`
  transition: opacity ${FADE_TRANSITION_MS}ms ease;
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

  const [showView, setShowView] = useState(false)
  const [showSelf, setShowSelf] = useState(false)

  const { view } = useParams({
    view: "default",
  })

  const safeView = VIEW_TYPES.find((v) => v === view) ?? "default"

  const renderView = () => {
    if (!showView) return null

    if (safeView === "poster") {
      return (
        <Transition timeout={VIEW_TRANSITION_MS} key={safeView}>
          {(status) => <PosterView transition={status} />}
        </Transition>
      )
    }
  }

  const renderBackground = () => {
    if (app.keyed) return null
    return <Background />
  }

  useEffect(() => {
    const show = async () => {
      setShowSelf(true)
      setShowView(true)
    }

    const hide = async () => {
      setShowView(false)
      await delay(200)
      setShowSelf(false)
    }

    if (app.state === "active") {
      show()
    }

    if (app.state === "exit") {
      hide()
    }
  }, [app.state])

  return (
    <Container keyed={app.keyed}>
      <Inner visible={showSelf}>
        {renderBackground()}
        <View>{renderView()}</View>
      </Inner>
    </Container>
  )
}
