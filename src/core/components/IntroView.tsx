import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"
import { cardStyle } from "./Card"
import { Logo } from "./Logo"
import { TransitionStatus } from "react-transition-group"
import { SequenceEntry } from "../../sequencing/components/ViewSequence"
import stylex from "@stylexjs/stylex"

const ENTER_MS = 1200
const EXIT_MS = 700

export const INTRO_VIEW_SEQUENCE_ENTRY: SequenceEntry = {
  name: "intro",
  duration: ENTER_MS + 2000,
  render: (status) => <IntroView status={status} />,
  overlay: false,
}

const CardFall = keyframes`
  0% {}

  100% {
    transform: rotate(10deg) translateY(60%);
  }
`

const Container = styled.div<{ status: TransitionStatus }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${(props) => props.theme.fontColor.normal};
  &:before {
    content: "";
    position: absolute;

    height: 200%;
    width: 200%;

    top: 0;
    right: 0;

    transform: rotate(10deg) translateY(-220px);

    ${(props) => {
      if (props.status === "exiting")
        return css`
          animation: ${CardFall} ${EXIT_MS}ms ease-in-out forwards;
        `
    }}
  }
`

const LogoUnblur = keyframes`
  0% {
    filter: blur(120px);
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const LogoFall = keyframes`
  0% {}

  50% {
    opacity: 0;
  }

  100% {
    transform: translateY(800px);
    opacity: 0;
  }
`

const LogoContainer = styled.div<{ status: TransitionStatus }>`
  width: 600px;

  position: relative;
  z-index: 1;

  animation: ${(props) => {
    if (props.status === "entering") {
      return css`
        ${LogoUnblur} ${ENTER_MS}ms ease-in-out forwards;
        animation-delay: 200ms;

        opacity: 0;
      `
    }

    if (props.status === "exiting") {
      return css`
        ${LogoFall} ${EXIT_MS}ms ease-in-out forwards
      `
    }
  }};
`

export type IntroView = {
  status: TransitionStatus
}

export function IntroView(props: IntroView) {
  const { status } = props

  return (
    <Container {...stylex.props(cardStyle.baseCard)} status={status}>
      <LogoContainer status={status}>
        <Logo />
      </LogoContainer>
    </Container>
  )
}
