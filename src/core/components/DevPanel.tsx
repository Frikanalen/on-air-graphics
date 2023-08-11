import styled from "@emotion/styled"
import { RESOLUTION } from "../constants"
import { Content } from "./Content"
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
export const DevPanel = () => (
  <DevContainerDiv>
    <div>
      <h1>Frikanalen sendegrafikk</h1>
      <Content />
      <DevPanelButtons>
        <h2>Events</h2>
        <button onClick={window.play}>PLAY</button>
        <button onClick={window.stop}>STOP</button>
      </DevPanelButtons>
    </div>
  </DevContainerDiv>
)
