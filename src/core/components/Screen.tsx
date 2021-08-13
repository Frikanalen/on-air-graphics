import React from "react"
import styled from "@emotion/styled"

import { RESOLUTION } from "../constants"
const [width, height] = RESOLUTION

const Container = styled.div`
  width: ${width}px;
  height: ${height}px;

  border: solid 1px red;
  margin-top: -1px;
  margin-left: -1px;
`

export function Screen() {
  return <Container />
}
