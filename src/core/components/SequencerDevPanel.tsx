import { useState } from "react"
import { Sequencer } from "./Sequencer.tsx"
import { HStack } from "./HStack.tsx"
import { Button } from "./Button.tsx"
import { Heading } from "./Heading.tsx"

export const SequencerDevPanel = () => {
  const [show, setShow] = useState(true)
  const reset = () => {
    setShow(false)
    setTimeout(() => {
      setShow(true)
      window.play()
    }, 100)
  }

  return (
    <>
      {show && <Sequencer />}
      <HStack>
        <Button onClick={reset}>RESET</Button>
        <Heading level={2}>Events</Heading>
        <Button onClick={window.play}>PLAY</Button>
        <Button onClick={window.stop}>STOP</Button>
      </HStack>
    </>
  )
}
