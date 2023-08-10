import styled from "@emotion/styled"
import { RESOLUTION } from "../constants"

const DevPanelContainer = styled.div`
  background: black;
  width: ${RESOLUTION[0]}px;
  padding: 1em;
  display: flex;
  align-items: center;
  gap: 1em;
  color: #ddd;
`
export const DevPanel = () => {
  if (import.meta.env.PROD) return null

  return (
    <DevPanelContainer>
      <h2>Utviklermeny</h2>
      <button onClick={window.play}>Play</button>
      <button onClick={window.stop}>Stop</button>
    </DevPanelContainer>
  )
}
