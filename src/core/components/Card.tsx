import { css, Theme } from "@emotion/react"
import styled from "@emotion/styled"

export const CardStyle = (props: { theme: Theme }) => css`
  background: ${props.theme.color.card};
  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(30px);
`

export const Card = styled.div`
  padding: 24px;
  border-radius: 8px;

  ${CardStyle}
`
