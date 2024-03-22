import { Heading } from "./Heading.tsx"
import { VStack } from "./VStack.tsx"
import { DevModePage } from "./DevModePage.tsx"
import { SequencerDevPanel } from "./SequencerDevPanel.tsx"
import { HStack } from "./HStack.tsx"
import { useState } from "react"
import { Button } from "./Button.tsx"
import { FullsizeContainer } from "./FullsizeContainer.tsx"

const ViewDevPanel = () => {
  return (
    <>
      <FullsizeContainer>Hiello!</FullsizeContainer>
      <HStack>
        <Button onClick={() => {}}>NEXT</Button>
      </HStack>{" "}
    </>
  )
}

export const DevPanel = () => {
  const [mode, setMode] = useState<"sequencer" | "view">("sequencer")
  return (
    <DevModePage>
      <VStack>
        <Heading level={1}>Frikanalen sendegrafikk</Heading>
        <HStack>
          <Button onClick={() => setMode("sequencer")}>Sequencer</Button>
          <Button onClick={() => setMode("view")}>Logo</Button>
        </HStack>
        {mode === "sequencer" ? <SequencerDevPanel /> : null}
        {mode === "view" ? <ViewDevPanel /> : null}
      </VStack>
    </DevModePage>
  )
}
