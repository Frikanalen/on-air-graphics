import { SequenceCue, TimedSequencerCue } from "../../views/types.ts"

export const timePagesToFillDuration = (
  duration: number,
  cueList: SequenceCue[],
): TimedSequencerCue[] => {
  const [pretimed, dynamic] = cueList.reduce(
    (acc, item) => {
      if (typeof item.duration === "number") {
        acc[0].push({ ...item, outTimeMs: item.duration } as TimedSequencerCue)
      } else {
        acc[1].push(item)
      }
      return acc
    },
    [[], []] as [TimedSequencerCue[], SequenceCue[]],
  )

  // First we solve for the fixed intervals
  const reservedTimeMs = pretimed.reduce(
    (acc, { outTimeMs }) => acc + outTimeMs,
    0,
  )

  if (reservedTimeMs > duration)
    throw new Error("Duration too short for minimum schedule")

  // naively divide dynamic time equally, weighting to be supported in the future
  const dynamicDurationMs = (duration - reservedTimeMs) / dynamic.length

  const timedPages = dynamic.map((item) => {
    return { ...item, outTimeMs: dynamicDurationMs } as TimedSequencerCue
  })

  return [...pretimed, ...timedPages]
}
