import styled from "@emotion/styled"
import { Sequencer } from "./Sequencer.tsx"
import { useState } from "react"
import { RESOLUTION } from "../../theme.stylex.ts"
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
const DevPanelButtons = styled.div`
  background: black;
  width: ${RESOLUTION[0]}px;
  padding: 1em;
  display: flex;
  align-items: baseline;
  gap: 2em;
  color: #ddd;

  button {
    background: #333;
    color: #ddd;
    font-weight: bold;
    border: none;
    padding: 0.5em 1em;
    font-family: monospace;
    cursor: pointer;
    &:hover {
      background: #444;
    }
    &:active {
      background: #555;
    }
  }
`
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
        <DevPanelButtons>
          <button onClick={reset}>RESET</button>
          <h2>Events</h2>
          <button onClick={window.play}>PLAY</button>
          <button onClick={window.stop}>STOP</button>
        </DevPanelButtons>
      </div>
    </DevContainerDiv>
  )
}
