import { useContext, useMemo, useState } from "react"
import { RESOLUTION } from "../constants"
import { useSequenceName } from "../hooks/useSequenceName"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { usePlayheadPlaying } from "../../sequencing/clock/usePlayhead"
import { scenarios } from "../../sequencing/plan/scenarios"
import { tiersFor } from "../../sequencing/plan/tiers"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"
import { AppContext } from "./AppContext.tsx"
import { ScheduleContext } from "./ScheduleContext.tsx"
import { Content } from "./Content"
import { Timeline } from "./dev/Timeline"

const button =
  "cursor-pointer border-none bg-[#333] px-4 py-2 font-mono font-bold text-[#ddd] hover:bg-[#444] active:bg-[#555]"

const chip =
  "cursor-pointer rounded-sm border-none bg-[#333] px-3 py-1.5 font-mono text-[12px] text-[#ddd] hover:bg-[#444] active:bg-[#555]"

/**
 * Overrides the budget for everything below it, so the scenario buttons can
 * ask "what would this look like with a minute?" without touching the URL.
 */
export const DevPanel = () => {
  const app = useContext(AppContext)
  const [budget, setBudget] = useState(app.budget)

  const context = useMemo(() => ({ ...app, budget }), [app, budget])

  return (
    <AppContext.Provider value={context}>
      <DevPanelBody budget={budget} onBudget={setBudget} />
    </AppContext.Provider>
  )
}

interface DevPanelBodyProps {
  budget: number
  onBudget: (budget: number) => void
}

const DevPanelBody = (props: DevPanelBodyProps) => {
  const { budget, onBudget } = props

  const playhead = useContext(PlayheadContext)
  const schedule = useContext(ScheduleContext)
  const sequence = useSequenceName()
  const plan = useTimelinePlan()
  const playing = usePlayheadPlaying(playhead)

  /*
   * The budgets worth testing are the ones either side of a tier boundary, and
   * those move whenever a segment is retuned -- so they are derived from the
   * tiers rather than written down here.
   */
  const options = useMemo(
    () => scenarios(tiersFor(sequence), { schedule }),
    [sequence, schedule],
  )

  const play = (next = budget) => {
    onBudget(next)
    window.play()
    playhead.restart()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#333] py-8">
      <div className="flex flex-col gap-6" style={{ maxWidth: RESOLUTION[0] }}>
        <h1 className="w-full text-[#999]">Frikanalen sendegrafikk</h1>

        <Content />

        <div
          className="flex flex-col gap-4 bg-black p-4"
          style={{ width: RESOLUTION[0] }}
        >
          <Timeline plan={plan} playhead={playhead} />

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[12px] text-[#777]">scenarios</span>
            {options.map((scenario) => (
              <button
                key={scenario.budget}
                className={chip}
                onClick={() => play(scenario.budget)}
                title={`?duration=${scenario.budget}`}
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] text-[#777]">
            <label className="flex items-center gap-2">
              budget
              <input
                type="number"
                step={0.5}
                min={0}
                value={budget / 1000}
                onChange={(event) =>
                  onBudget(Math.max(Number(event.target.value), 0) * 1000)
                }
                className="w-24 bg-[#222] px-2 py-1 text-[#ddd]"
              />
              s
            </label>

            <button
              className={chip}
              onClick={() => playhead.seek(playhead.now() - 500)}
            >
              −500ms
            </button>
            <button
              className={chip}
              onClick={() => (playing ? playhead.pause() : playhead.resume())}
            >
              {playing ? "PAUSE" : "RESUME"}
            </button>
            <button
              className={chip}
              onClick={() => playhead.seek(playhead.now() + 500)}
            >
              +500ms
            </button>
          </div>

          <div className="flex items-baseline gap-8 text-[#ddd]">
            <button className={button} onClick={() => play()}>
              RESET
            </button>
            <h2>Events</h2>
            <button className={button} onClick={() => play()}>
              PLAY
            </button>
            <button className={button} onClick={window.stop}>
              STOP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
