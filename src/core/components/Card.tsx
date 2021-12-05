import { css, Theme } from "@emotion/react"
import styled from "@emotion/styled"

export const CardStyle = (props: { theme: Theme }) => css`
  background: ${props.theme.color.card};
  box-shadow: ${props.theme.shadow.card};
  backdrop-filter: blur(30px);

  @supports not (backdrop-filter: blur(30px)) {
    background: ${props.theme.color.cardFallback};
  }
`

export const Card = styled.div`
  padding: 24px;
  border-radius: 8px;

  ${CardStyle}
`
