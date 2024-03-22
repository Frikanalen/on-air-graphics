import styled from "@emotion/styled"
import { Sequencer } from "./Sequencer.tsx"
import { useState } from "react"
import { RESOLUTION } from "../../theme.stylex.ts"
import { Button } from "./Button.tsx"
import { HStack } from "./HStack.tsx"

const DevContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  background: #333;

  > div {
    display: flex;
    flex-direction: column;
    max-width: ${RESOLUTION[0]}px;
    gap: 2em;

    h1 {
      color: #999;
      width: 100%;
    }
  }
}`

export const DevPanel = () => {
  const [show, setShow] = useState(true)
  const reset = () => {
    setShow(false)
    setTimeout(() => {
      setShow(true)
      window.play()
    }, 100)
  }

  return (
    <DevContainerDiv>
      <div>
        <h1>Frikanalen sendegrafikk</h1>
        {show && <Sequencer />}
        <HStack>
          <Button onClick={reset}>RESET</Button>
          <h2>Events</h2>
          <Button onClick={window.play}>PLAY</Button>
          <Button onClick={window.stop}>STOP</Button>
        </HStack>
      </div>
    </DevContainerDiv>
  )
}
