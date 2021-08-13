import React from "react"
import styled from "@emotion/styled"

import { Background } from "./Background"
import { Overlay } from "./Overlay"

import { RESOLUTION } from "../constants"
const [width, height] = RESOLUTION

const Container = styled.div`
  width: ${width}px;
  height: ${height}px;

  position: relative;
`

export function Screen() {
  return (
    <Container>
      <Background timeOfDay="day" />
      <Overlay />
    </Container>
  )
}
