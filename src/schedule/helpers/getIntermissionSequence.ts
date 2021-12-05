import React from "react"
import { INTRO_VIEW_SEQUENCE_ENTRY } from "../../core/components/IntroView"
import { SequenceEntry } from "../../sequencing/components/ViewSequence"
import { ScheduleView } from "../components/ScheduleView"

export const getIntermissionSequence = (duration: number): SequenceEntry[] => {
  // const available = duration - INTRO_VIEW_SEQUENCE_ENTRY.duration

  return [
    INTRO_VIEW_SEQUENCE_ENTRY,
    {
      name: "schedule",
      duration: Infinity,
      render: (status) => React.createElement(ScheduleView, { status }),
    },
  ]
}
