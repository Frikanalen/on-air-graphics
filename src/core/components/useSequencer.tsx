import { useContext, useEffect, useMemo, useReducer } from "react"

import { AppContext } from "./AppContext.tsx"
import { timePagesToFillDuration } from "./timePagesToFillDuration.ts"
import { getSequenceComponentProps } from "./getSequenceComponentProps.tsx"

import { SequenceCue, TimedSequencerCue } from "../../views/types.ts"

export type SequencerPhase = "entering" | "exiting" | "entered"

const NextMode: Record<SequencerPhase, SequencerPhase> = {
  entering: "entered",
  entered: "exiting",
  exiting: "entering",
}

export type SequencerState = {
  currentPage: number
  phase: SequencerPhase
  timeline: TimelineEntry[]
}

type SequencerAction = { type: "cuePage" }

type TimelineEntry = [number]

const buildTimeline = (timedPages: TimedSequencerCue[]) => {
  let currentTime = 0
  return timedPages.reduce((acc, item) => {
    acc.push([currentTime])
    acc.push([currentTime + 500])
    acc.push([item.outTimeMs - 500])
    currentTime += item.outTimeMs
    return acc
  }, [] as TimelineEntry[])
}

const makeInitialState = (
  timelineDurationMs: number,
  cueList: SequenceCue[],
): SequencerState => ({
  currentPage: 0,
  phase: "entering",
  timeline: buildTimeline(timePagesToFillDuration(timelineDurationMs, cueList)),
})

const reducer = (
  state: SequencerState,
  action: SequencerAction,
): SequencerState => {
  console.log(action, state)
  switch (action.type) {
    case "cuePage":
      if (state.phase === "exiting") {
        const nextPage =
          state.currentPage === state.timeline.length / 3 - 1
            ? 0
            : state.currentPage + 1
        return { ...state, phase: NextMode[state.phase], currentPage: nextPage }
      }

      return { ...state, phase: NextMode[state.phase] }

    default:
      return state
  }
}

export const useSequencer = (cueList: SequenceCue[]) => {
  const { state: appState, durationMs } = useContext(AppContext)

  const [{ currentPage, phase, timeline }, dispatch] = useReducer(
    reducer,
    useMemo(() => makeInitialState(durationMs, cueList), []),
  )

  const render = cueList.map((cue, index) =>
    cue.render(getSequenceComponentProps(index, currentPage, phase)),
  )

  // Calculate when to set the next timer
  useEffect(() => {
    if (appState === "idle") return

    console.log(timeline)
    const timeouts = timeline.map((item) => {
      return setTimeout(() => {
        dispatch({ type: "cuePage" })
      }, item[0])
    })
    timeouts.push(
      setTimeout(
        () => {
          console.log("restarting timeline")
          dispatch({ type: "cuePage" })
        },
        timeline[timeline.length - 1][0] + 500,
      ),
    )

    return () => timeouts.forEach((timeout) => clearTimeout(timeout))
  }, [timeline, appState])

  return { render }
}
