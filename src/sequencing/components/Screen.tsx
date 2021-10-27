import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"

import { Background } from "../../core/components/Background"

import { RESOLUTION } from "../../core/constants"
import { IntroSequence } from "./IntroSequence"
import { wait } from "../../core/helpers/wait"
import { UpcomingView } from "../../schedule/components/UpcomingView"
const [width, height] = RESOLUTION

const FADE_TRANSITION_MS = 500
const MINIMUM_TIME = 15000

const Container = styled.div`
  width: ${width}px;
  height: ${height}px;

  position: relative;
  overflow: hidden;

  background: black;
`

const Content = styled.div<{ visible: boolean }>`
  position: absolute;

  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;

  transition: opacity ${FADE_TRANSITION_MS}ms ease;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`

const Overlay = styled.div<{ visible: boolean }>`
  padding: 64px;

  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;

  &:before {
    content: "";
    background: ${(props) => props.theme.gradient.overlay};

    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;

    transition: opacity ${FADE_TRANSITION_MS}ms ease;
    opacity: ${(props) => (props.visible ? 1 : 0)};
  }
`

type SequenceItem = {
  type: "upcoming"
  duration: number
}

const start = Date.now()
const params = new URLSearchParams(window.location.search)

const duration = Number(params.get("duration")) || MINIMUM_TIME
const availableTime = Math.max(duration - FADE_TRANSITION_MS, MINIMUM_TIME)

export function Screen() {
  const [visible, setVisible] = useState(false)

  const [index, setIndex] = useState(0)
  const [sequence, setSequence] = useState<SequenceItem[]>([])

  const current = sequence[index]

  const createSequence = () => {
    const timeElapsed = Date.now() - start
    const remainingTime = availableTime - timeElapsed

    console.log({ timeElapsed, remainingTime })

    setSequence([{ type: "upcoming", duration: remainingTime }])
  }

  const advance = async () => {
    setIndex(index + 1)

    if (index > sequence.length - 2) {
      setVisible(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await wait(500)
      setVisible(true)
    }

    run()
  }, [])

  const renderContent = () => {
    if (!current) return

    if (current.type === "upcoming") {
      return (
        <UpcomingView
          key={index}
          duration={current.duration}
          onFinished={advance}
        />
      )
    }
  }

  return (
    <Container>
      <Content visible={visible}>
        <Background />
        <IntroSequence onFinished={createSequence} />
        <Overlay visible={!!current}>{renderContent()}</Overlay>
      </Content>
    </Container>
  )
}
