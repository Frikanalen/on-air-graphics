import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"

import { Background } from "../../core/components/Background"

import { RESOLUTION } from "../../core/constants"
import { IntroSequence } from "./IntroSequence"
import { UpcomingView } from "../../schedule/components/UpcomingView"
import { delay } from "../../core/helpers/delay"
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

const params = new URLSearchParams(window.location.search)
const duration = Number(params.get("duration")) || MINIMUM_TIME
const availableTime = Math.max(duration - FADE_TRANSITION_MS, MINIMUM_TIME)

export function Screen() {
  const [start, setStart] = useState(0)
  const [visible, setVisible] = useState(false)

  const [index, setIndex] = useState(0)
  const [sequence, setSequence] = useState<SequenceItem[]>([])

  const current = sequence[index]

  useEffect(() => {
    // CasparCG hook
    ;(window as any).play = async () => {
      setStart(Date.now())

      await delay(500)
      setVisible(true)
    }
  })

  const createSequence = () => {
    const timeElapsed = Date.now() - start
    const remainingTime = availableTime - timeElapsed

    setSequence([{ type: "upcoming", duration: remainingTime }])
  }

  const advance = async () => {
    setIndex(index + 1)

    if (index > sequence.length - 2) {
      setVisible(false)
    }
  }

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
        {visible ? <IntroSequence onFinished={createSequence} /> : null}
        <Overlay visible={!!current}>{renderContent()}</Overlay>
      </Content>
    </Container>
  )
}
