import { useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { RESOLUTION } from "../constants"
import { useFitScale } from "../hooks/useFitScale"
import { useSequenceName } from "../hooks/useSequenceName"
import { useNews } from "../../news/useNews"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext.ts"
import { usePlayheadPlaying } from "../../sequencing/clock/usePlayhead"
import { scenarios } from "../../sequencing/plan/scenarios"
import { tiersFor } from "../../sequencing/plan/tiers"
import { useTimelinePlan } from "../../sequencing/plan/useTimelinePlan"
import { AppContext } from "./AppContext.tsx"
import { ScheduleContext } from "./ScheduleContext.tsx"
import { Content } from "./Content"
import { Timeline } from "./dev/Timeline"

const [FRAME_WIDTH, FRAME_HEIGHT] = RESOLUTION

const control =
  "cursor-pointer rounded-sm border-none bg-[#333] px-3 py-1.5 text-left font-mono text-[12px] text-[#ddd] hover:bg-[#454545] active:bg-[#555]"

const panel = "rounded-sm bg-black p-3"

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

interface SectionProps {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: SectionProps) => (
  <section className="flex flex-col gap-1.5">
    <h2 className="text-[10px] font-normal tracking-[0.12em] text-[#666] uppercase">
      {title}
    </h2>
    {children}
  </section>
)

interface DevPanelBodyProps {
  budget: number
  onBudget: (budget: number) => void
}

const DevPanelBody = (props: DevPanelBodyProps) => {
  const { budget, onBudget } = props

  const playhead = useContext(PlayheadContext)
  const schedule = useContext(ScheduleContext)
  const news = useNews()
  const sequence = useSequenceName()
  const plan = useTimelinePlan()
  const playing = usePlayheadPlaying(playhead)

  const frameRef = useRef<HTMLDivElement>(null)
  const scale = useFitScale(frameRef, FRAME_WIDTH, FRAME_HEIGHT)

  const options = useMemo(
    () => scenarios(tiersFor(sequence), { schedule, news }),
    [sequence, schedule, news],
  )

  const play = (next = budget) => {
    onBudget(next)
    window.play()
    playhead.restart()
  }

  /*
   * The panel's own typography stays on the panel's own elements. Setting it
   * on the wrapper would inherit straight into the frame, and the graphics
   * would render in the dev panel's monospace instead of their own face --
   * a preview that no longer previews anything.
   */
  return (
    <div className="flex h-screen flex-col gap-2 bg-[#222] p-2">
      <div className="flex min-h-0 flex-1 gap-2">
        {/*
         * The frame keeps its authored resolution and is scaled to whatever is
         * left over, so what is on screen stays a faithful preview however
         * small the window gets.
         */}
        <div
          ref={frameRef}
          className="flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-sm bg-black"
        >
          <div
            style={{
              width: FRAME_WIDTH * scale,
              height: FRAME_HEIGHT * scale,
            }}
          >
            <div
              style={{
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <Content />
            </div>
          </div>
        </div>

        <aside
          className={`flex w-60 shrink-0 flex-col gap-4 overflow-y-auto font-mono text-[12px] text-[#ddd] ${panel}`}
        >
          <h1 className="text-[12px] font-normal text-[#888]">
            Frikanalen sendegrafikk
          </h1>

          <Section title="scenarios">
            {options.map((scenario) => (
              <button
                key={scenario.budget}
                className={control}
                onClick={() => play(scenario.budget)}
                title={`?duration=${scenario.budget}`}
              >
                {scenario.label}
              </button>
            ))}
          </Section>

          <Section title="budget">
            <label className="flex items-center gap-2 text-[#888]">
              <input
                type="number"
                step={0.5}
                min={0}
                value={budget / 1000}
                onChange={(event) =>
                  onBudget(Math.max(Number(event.target.value), 0) * 1000)
                }
                className="w-20 rounded-sm bg-[#333] px-2 py-1.5 text-[#ddd]"
              />
              sekunder
            </label>
          </Section>

          <Section title="playhead">
            <div className="flex gap-1.5">
              <button
                className={`${control} flex-1 text-center`}
                onClick={() => playhead.seek(playhead.now() - 500)}
              >
                −½s
              </button>
              <button
                className={`${control} flex-1 text-center`}
                onClick={() => (playing ? playhead.pause() : playhead.resume())}
              >
                {playing ? "pause" : "spill"}
              </button>
              <button
                className={`${control} flex-1 text-center`}
                onClick={() => playhead.seek(playhead.now() + 500)}
              >
                +½s
              </button>
            </div>
          </Section>

          {/* What the playout system sends; the graphics only ever react. */}
          <Section title="casparcg">
            <button className={control} onClick={() => play()}>
              PLAY
            </button>
            <button className={control} onClick={window.stop}>
              STOP
            </button>
          </Section>
        </aside>
      </div>

      <div className={`shrink-0 ${panel}`}>
        <Timeline plan={plan} playhead={playhead} />
      </div>
    </div>
  )
}
