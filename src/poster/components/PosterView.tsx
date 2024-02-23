import { useContext } from "react"
import styled from "@emotion/styled"
import { useParams } from "../../core/hooks/useParams"
import { css, keyframes } from "@emotion/react"
import { CardStyle } from "../../core/components/Card"
import { SVGIcon } from "../../core/components/SVGIcon"
import { size, transparentize } from "polished"
import { PosterType } from "../types"
import { POSTER_TYPES } from "../constants"
import { TransitionStatus } from "react-transition-group"
import { FADE_TRANSITION_MS } from "../../core/constants"
import { AppContext } from "../../core/components/AppContext.tsx"

const Container = styled.div`
  padding: 64px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
`

const ContentTransition = (reversed: boolean) => keyframes`
  ${reversed ? 0 : 100}% {
    transform: translateY(calc(100% + 32px));
    opacity: 0;
  }

  ${reversed ? 100 : 0}% {
    transform: translateY(0%);
    opacity: 1;
  }
`

const Content = styled.div<{
  keyed: boolean
  type: PosterType
  transition: TransitionStatus
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => {
    const { theme, keyed, type } = props

    if (type !== "info") return theme.stateColor[type]
    if (keyed) return theme.fontColor.overlay

    return theme.fontColor.normal
  }};

  ${(props) => {
    const { keyed } = props

    if (keyed) {
      return css`
        filter: drop-shadow(1px 1px 0px ${transparentize(0.2, "black")});
      `
    }

    return css`
      padding: 32px;

      position: relative;
      z-index: 2;

      ${CardStyle(props)}
      border-radius: 8px;
    `
  }};

  animation: ${(props) => ContentTransition(props.transition !== "exiting")}
    ${FADE_TRANSITION_MS}ms ease both;
`

const Icon = styled(SVGIcon)`
  ${size(42)};
  margin-right: 16px;
`

const Message = styled.span`
  font-size: 32px;
  font-weight: 500;
`

export type PosterViewProps = {
  transition: TransitionStatus
}

export function PosterView(props: PosterViewProps) {
  const { transition } = props
  const app = useContext(AppContext)

  const { message, type } = useParams({
    message: "Tekstplakat melding",
    type: "info",
  })

  const safeType = POSTER_TYPES.find((t) => t === type) ?? "info"

  return (
    <Container>
      <Content transition={transition} type={safeType} keyed={app.keyed}>
        <Icon name={safeType} />
        <Message>{message}</Message>
      </Content>
    </Container>
  )
}
