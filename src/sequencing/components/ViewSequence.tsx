import { useContext, useEffect, useState } from "react"
import styled from "@emotion/styled"
import {
  Transition,
  TransitionGroup,
  type TransitionStatus,
} from "react-transition-group"
import { cover } from "polished"
import { FADE_TRANSITION_MS } from "../../core/constants"
import { delay } from "../../core/helpers/delay"
import { AppContext } from "../../core/components/AppContext.tsx"

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

const DELAY = 200

export interface SequenceEntry {
  name: string
  duration: number
  render: (status: TransitionStatus) => JSX.Element
  overlay?: boolean
}

export interface ViewSequenceProps {
  sequence: SequenceEntry[]
}

export function ViewSequence(props: ViewSequenceProps) {
  const app = useContext(AppContext)
  const { sequence } = props

  const [index, setIndex] = useState(0)
  const [showView, setShowView] = useState(true)

  useEffect(() => {
    const entry = sequence[index]

    const advance = async () => {
      if (!Number.isFinite(entry.duration)) return

      await delay(entry.duration - DELAY)
      setShowView(false)
      await delay(DELAY)

      setShowView(true)
      setIndex(index + 1)
    }

    if (entry && app.state === "active") {
      advance()
    }
  }, [app, index])

  const renderView = () => {
    const entry = sequence[index]

    if (!showView || !entry || app.state !== "active") return null

    return (
      <Transition key={entry.name} timeout={2000}>
        {(status) => <View>{entry.render(status)}</View>}
      </Transition>
    )
  }

  const entry = sequence[index]
  const overlay = entry?.overlay !== false && app.state === "active"

  return (
    <Container overlay={overlay} keyed={app.keyed}>
      <TransitionGroup>{renderView()}</TransitionGroup>
    </Container>
  )
}
