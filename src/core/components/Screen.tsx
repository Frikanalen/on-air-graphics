import React from "react"
import styled from "@emotion/styled"

import { RESOLUTION } from "../constants"
import { Background } from "./Background"
const [width, height] = RESOLUTION

const Container = styled.div`
  width: ${width}px;
  height: ${height}px;

  border: solid 1px red;
  margin-top: -1px;
  margin-left: -1px;

  position: relative;
`

const Overlay = styled.div`
  padding: 64px;

  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;

  background: ${(props) => props.theme.gradient.overlay};
`

export function Screen() {
  return (
    <Container>
      <Background timeOfDay="day" />
      <Overlay></Overlay>
    </Container>
  )
}
