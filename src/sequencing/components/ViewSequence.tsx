import React, { useContext, useEffect } from "react"
import styled from "@emotion/styled"
import { useState } from "react"
import {
  Transition,
  TransitionGroup,
  TransitionStatus,
} from "react-transition-group"
import { FADE_TRANSITION_MS } from "../../core/constants"
import { delay } from "../../core/helpers/delay"
import { App } from "../../core/components/App"
import { cover } from "polished"

const Container = styled.div<{ keyed: boolean; overlay: boolean }>`
  &:before {
    content: "";
    background: ${(props) =>
      props.keyed ? "transparent" : props.theme.gradient.overlay};

    position: absolute;
    ${cover()}

    transition: opacity ${FADE_TRANSITION_MS}ms ease;
    opacity: ${(props) => (props.overlay ? 1 : 0)};
  }
`

const View = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`

export type SequenceEntry = {
  name: string
  duration: number
  render: (status: TransitionStatus) => JSX.Element
  overlay?: boolean
}

export type ViewSequenceProps = {
  sequence: SequenceEntry[]
}

export function ViewSequence(props: ViewSequenceProps) {
  const app = useContext(App.context)
  const { sequence } = props

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const entry = sequence[index]

    const advance = async () => {
      if (!Number.isFinite(entry.duration)) return

      await delay(entry.duration)
      setIndex(index + 1)
    }

    if (entry && app.state === "active") {
      advance()
    }
  }, [app, index])

  const renderView = () => {
    const entry = sequence[index]

    if (!entry || app.state !== "active") return null

    return (
      <Transition key={entry.name} timeout={2000}>
        {(status) => <View>{entry.render(status)}</View>}
      </Transition>
    )
  }

  const entry = sequence[index]
  const overlay = entry && entry.overlay !== false && app.state === "active"

  return (
    <Container overlay={overlay} keyed={app.keyed}>
      <TransitionGroup>{renderView()}</TransitionGroup>
    </Container>
  )
}
