import { useContext } from "react"
import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/react"
import { type TransitionStatus } from "react-transition-group"
import { useParams } from "../core/hooks/useParams.ts"
import { SVGIcon } from "../core/components/SVGIcon.tsx"
import { type PosterType } from "../poster/types.ts"
import { POSTER_TYPES } from "../poster/constants.ts"
import { FADE_TRANSITION_MS } from "../core/constants.ts"
import { AppContext } from "../core/components/AppContext.tsx"
import stylex from "@stylexjs/stylex"
import { cardStyle } from "../core/components/Card.tsx"

const ContentTransition = (reversed: boolean) => keyframes`
  ${reversed ? "0%" : "100%"} {
    transform: translateY(calc(100% + 32px));
    opacity: 0;
  }

  ${reversed ? "100%" : "0%"} {
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

  color: ${({ keyed, theme, type }) => {
    if (type !== "info") return theme.stateColor[type]
    if (keyed) return theme.fontColor.overlay
    return theme.fontColor.normal
  }};

  ${(props) => {
    const { keyed } = props

    if (keyed) {
      return css`
        filter: drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.8));
      `
    }

    return css`
      padding: 32px;

      position: relative;
      z-index: 2;

      border-radius: 8px;
    `
  }};

  animation: ${(props) => ContentTransition(props.transition !== "exiting")}
    ${FADE_TRANSITION_MS}ms ease both;
`

const Icon = styled(SVGIcon)`
  height: 42px;
  width: 42px;
  margin-right: 16px;
`

const Message = styled.span`
  font-size: 32px;
  font-weight: 500;
`

export const PosterView = ({
  transition,
}: {
  transition: TransitionStatus
}) => {
  const app = useContext(AppContext)

  const { message, type } = useParams({
    message: "Tekstplakat melding",
    type: "info",
  })

  const safeType = POSTER_TYPES.find((t) => t === type) ?? "info"

  return (
    <div className={"p-16 flex items-end justify-center h-full"}>
      <Content
        {...stylex.props(cardStyle.baseCard)}
        transition={transition}
        type={safeType}
        keyed={app.keyed}
      >
        <Icon name={safeType} />
        <Message>{message}</Message>
      </Content>
    </div>
  )
}
