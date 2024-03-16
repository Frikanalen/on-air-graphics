import { TransitionStatus } from "react-transition-group"
import { ReactNode } from "react"

export type TransitionState = {
  transition: TransitionStatus
}

export interface SequencerComponentProps {
  sequencerCues: TransitionState
}

export type SequenceCue = {
  render: (props: SequencerComponentProps) => ReactNode
  duration?: number
}

export interface TimedSequencerCue extends SequenceCue {
  outTimeMs: number
}
