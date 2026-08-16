import { useContext, useMemo } from "react"
import { RESOLUTION, SEQUENCE_NAMES } from "../constants"
import { useParams } from "../hooks/useParams"
import { Player } from "../../sequencing/components/Player"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import {
  INTERMISSION_TIERS,
  POSTER_TIERS,
  plan as planTimeline,
} from "../../sequencing/plan/tiers"
import { AppContext } from "./AppContext.tsx"
import { ScheduleContext } from "./ScheduleContext.tsx"

const [width, height] = RESOLUTION

export function Content() {
  const { budget } = useContext(AppContext)
  const schedule = useContext(ScheduleContext)
  const playhead = useContext(PlayheadContext)

  const { sequence } = useParams({
    sequence: "default",
  })

  const sequenceName = SEQUENCE_NAMES.find((s) => s === sequence) ?? "default"

  const plan = useMemo(
    () =>
      planTimeline(
        budget,
        { schedule },
        sequenceName === "poster" ? POSTER_TIERS : INTERMISSION_TIERS,
      ),
    [budget, schedule, sequenceName],
  )

  return (
    <div
      className="relative overflow-hidden bg-transparent text-normal"
      style={{ width, height }}
    >
      {/*
       * Nothing here may fade the views as a group. An ancestor at opacity < 1
       * is a backdrop root, which cuts the cards' backdrop-filter off from what
       * it is meant to blur and flattens them for the length of the fade. Each
       * view carries its own entrance and exit instead.
       */}
      <Player plan={plan} playhead={playhead} />
    </div>
  )
}
