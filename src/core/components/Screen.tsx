import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"

import { Background } from "./Background"
import { Overlay } from "./Overlay"

import { RESOLUTION } from "../constants"
const [width, height] = RESOLUTION

const Container = styled.div`
  width: ${width}px;
  height: ${height}px;

  position: relative;
  overflow: hidden;

  background: black;
`

const Content = styled.div<{ visible: boolean }>`
  position: absolute;

  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;

  transition: opacity 500ms ease;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`

export function Screen() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 500)
  }, [])

  return (
    <Container>
      <Content visible={visible}>
        <Background />
      </Content>
    </Container>
  )
}
