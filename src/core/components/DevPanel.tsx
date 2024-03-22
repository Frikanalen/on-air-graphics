import { Sequencer } from "./Sequencer.tsx"
import { useState } from "react"
import { Button } from "./Button.tsx"
import { HStack } from "./HStack.tsx"
import { Heading } from "./Heading.tsx"
import { VStack } from "./VStack.tsx"
import { DevContainer } from "./DevContainer.tsx"

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
    <DevContainer>
      <VStack>
        <Heading level={1}>Frikanalen sendegrafikk</Heading>
        {show && <Sequencer />}
        <HStack>
          <Button onClick={reset}>RESET</Button>
          <Heading level={2}>Events</Heading>
          <Button onClick={window.play}>PLAY</Button>
          <Button onClick={window.stop}>STOP</Button>
        </HStack>
      </VStack>
    </DevContainer>
  )
}
