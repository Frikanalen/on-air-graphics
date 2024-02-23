import React from "react"
import { INTRO_VIEW_SEQUENCE_ENTRY } from "../../core/components/IntroView"
import { SequenceEntry } from "../../sequencing/components/ViewSequence"
import { ScheduleView } from "../components/ScheduleView"

export const getIntermissionSequence = (): SequenceEntry[] => [
  INTRO_VIEW_SEQUENCE_ENTRY,
  {
    name: "schedule",
    duration: Infinity,
    render: (status) => React.createElement(ScheduleView, { status }),
  },
]
