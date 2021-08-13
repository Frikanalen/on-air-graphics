import styled from "@emotion/styled"
import React from "react"

const Container = styled.div`
  padding: 64px;

  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;

  background: ${(props) => props.theme.gradient.overlay};
`

export function Overlay() {
  return <Container></Container>
}
