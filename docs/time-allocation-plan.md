# Budget-driven timeline: implementation plan

**Status:** all four phases landed. The graphics now fill the time they are
given: a five second slot is the channel's mark, half a minute is the full
schedule, and a minute makes room for channel news and a closing slate.
**Base:** `feature/timeline`, cut from main after the styling work merged.
**Goal:** make the graphics fill _any_ allotted time intelligently — 5 s is a logo
sting, 30 s adds the upcoming programme, a minute or more makes room for channel
news posters and an organisation slate before the video airs.

This document is a handoff spec. The architecture is settled and every design
question below is answered; what remains is mechanical. Do not re-open the
decisions in "Locked decisions" — if one of them turns out to be wrong during
implementation, stop and raise it rather than silently choosing differently.

---

## 1. Current state (as of 2026-08-16, commit 27b47f7)

Established by reading the tree; recorded so the implementing model does not
need to re-derive it.

**The budget is parsed and then ignored.** `?duration=` is read in
`src/core/components/App.tsx` via `useParams`, clamped
(`Math.max(params.duration - FADE_TRANSITION_MS, MINIMUM_SCREEN_TIME)`), placed
on `AppContext.duration` — and **no component reads it**. A grep for `duration`
finds only the definition, the default, and unrelated per-entry durations.

**Timing today is hardcoded.** `ViewSequence` walks a `SequenceEntry[]`, each
with a fixed `duration`:

- intro — `ENTER_MS + 2000` = 3200 ms (`core/components/IntroView.tsx`)
- schedule — `Infinity` (`schedule/helpers/getIntermissionSequence.ts`)
- poster — `Infinity` (`core/components/Content.tsx`)

`ViewSequence` bails on non-finite durations, so the last view holds until the
playout system calls `window.stop()`. There is no budget arithmetic anywhere.

**Historical note.** Budget logic existed once: commit `3823928` ("Fix
scheduling and add duration query param") computed
`remainingTime = availableTime - timeElapsed` from a module-load timestamp. It
was lost in the `8a1ceb1` refactor — the parsing survived, the use of it did
not. This plan restores the intent properly.

**Latent bugs to fix in passing (all confirmed, not speculative):**

1. `ViewSequence.tsx:49` has deps `[app, index]`, and `App` recreates the
   context object every render — so any `App` re-render restarts `advance()`
   for the current index, stacking concurrent `delay` chains. Masked today only
   because the durations that matter are `Infinity`. Phase 2 removes the timer
   chains entirely, which removes this structurally.
2. ~~`useParams` boolean branch returns the raw string~~ — **fixed upstream**
   before this work started; it now treats `false/0/no/off` as off.
3. ~~`useSchedule()` is called twice, fetching twice~~ — **fixed upstream** by
   `2d83edd`, which added `ScheduleContext`. `App` fetches once and holds the
   loading screen; views read the context. The planner takes its schedule from
   the same context, so no hoisting is needed.

---

## 2. Architecture

Separate **planning** from **playback**, and make both pure functions:

```
budget + data ──▶ tier selection ──▶ allocate() ──▶ Plan
Plan + playhead t ──▶ resolve() ──▶ what is on screen right now
```

Two orthogonal layers:

- **Tiers decide composition.** Which _set_ of views airs at all. A 5 s budget
  and a 5 minute budget are different programmes, not the same programme
  stretched.
- **Allocation decides stretch.** Within a chosen tier, segments declare
  flexbox-style constraints (`min` / `basis` / `max` / `grow`) and the solver
  distributes the budget. Give `logo-and-next` 30 s or 50 s and the programme
  segment absorbs the difference — no new tier needed.

Tiers therefore exist only where composition should change; the three named
above are likely all that is needed, not a ladder of ten.

**Tier thresholds are derived, not maintained.** A tier's minimum budget is the
sum of its segments' `min` values. Add an org slate to the `full` tier and its
threshold moves automatically — it can never drift out of sync with reality.
`minBudget` exists only as an editorial override ("technically fits in 38 s but
feels rushed under 45"); leave it unset until a tier actually feels rushed.

Because playback is `f(plan, t)`, dev-mode scrubbing is free: the same pure
function that drives air renders any timestamp on demand.

---

## 3. Locked decisions

| Question           | Decision                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Units              | `?duration=` is **milliseconds**, end to end. No conversion anywhere.                                                                                                                                                                                                                                                                                                                                                    |
| Clock origin       | Budget runs from `window.play()`. The plan is computed before play (pure and cheap, recomputed when inputs change); the clock starts at play.                                                                                                                                                                                                                                                                            |
| Exit fade          | `plan()` reserves `FADE_TRANSITION_MS` off the top of the budget, once, internally.                                                                                                                                                                                                                                                                                                                                      |
| Sub-minimum budget | Degrade by tier, never floor. Below the poorest tier's threshold, squeeze that tier's mins and **overrun** as a last resort. `MINIMUM_SCREEN_TIME` is deleted.                                                                                                                                                                                                                                                           |
| Leftover time      | Every tier must contain at least one segment with `grow > 0 && max === Infinity` (asserted at build time), so slack is always absorbable. Past `plan.total` the last segment holds in `entered` until `window.stop()` — same as today's `Infinity` behaviour.                                                                                                                                                            |
| Transitions        | `SegmentStatus` is derived from segment-local time, against durations **each segment declares** (`enter` / `exit`) rather than a flat window — see the correction below. A view's exit plays _over the start of the next segment_, so two views are on screen during a handover. The last segment never exits. **`react-transition-group` leaves the sequencing path.** The 200 ms `DELAY` gap between views is dropped. |
| Scrub fidelity     | Seeking remounts the segment at the new position; CSS entrance animations replay from their start. Segment and timing are exact, animation phase is approximate. Accepted dev-mode limitation — do **not** build negative-animation-delay machinery.                                                                                                                                                                     |
| CasparCG contract  | Unchanged: `window.play/stop/update/next`, `?duration` (ms), `?keyed`, `?sequence`, `?message`, `?type`.                                                                                                                                                                                                                                                                                                                 |
| Test runner        | Add `vitest` (devDependency + `"test": "vitest run"`) with a standalone `vitest.config.ts`. Phase 1 is pure TypeScript, so no Vite plugins are required.                                                                                                                                                                                                                                                                 |

---

## 4. Phase 1 — pure core (`src/sequencing/plan/`)

New files only. Fully unit-tested. Nothing imports them yet, so this phase
cannot regress on-air behaviour and should land and be reviewed on its own.

### 4.1 `plan/types.ts`

```ts
import type { ReactNode } from "react"
import type { ScheduleItem } from "../../schedule/types"

export type SegmentStatus = "entering" | "entered" | "exiting"

export interface SegmentTime {
  t: number // ms into this segment
  duration: number // allocated ms
  status: SegmentStatus
}

export interface SegmentSpec {
  name: string
  min: number // ms; below this the tier must not be selected
  basis: number // preferred ms (>= min)
  max: number // ms; Infinity = fully elastic
  grow: number // 0 = rigid; otherwise share of leftover
  overlay?: boolean // default true, matching ViewSequence today
  render: (time: SegmentTime) => ReactNode
}

export interface PlannedSegment {
  spec: SegmentSpec
  start: number // ms offset from plan start
  duration: number // integer ms
}

export interface Plan {
  tierName: string
  budget: number // what was asked for (after the fade reserve)
  total: number // what was planned (== budget except on overrun)
  segments: PlannedSegment[]
}

export interface PlanInputs {
  schedule: ScheduleItem[]
}

export interface TimelineTier {
  name: string
  build: (data: PlanInputs) => SegmentSpec[]
  minBudget?: number // editorial override; defaults to the derived sum of mins
}
```

### 4.2 `plan/allocate.ts` — the solver

Use this algorithm as written; it is the load-bearing piece.

```ts
const EPS = 1e-6
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi)

export function minDuration(specs: SegmentSpec[]): number {
  return specs.reduce((a, s) => a + s.min, 0)
}

export function allocate(
  tierName: string,
  specs: SegmentSpec[],
  budgetMs: number,
): Plan {
  if (!specs.some((s) => s.grow > 0 && s.max === Infinity))
    throw new Error(
      `Tier "${tierName}" needs a segment with grow > 0 and max: Infinity`,
    )

  const dur = specs.map((s) => clamp(s.basis, s.min, s.max))
  const sum = () => dur.reduce((a, b) => a + b, 0)

  if (sum() > budgetMs) {
    // Shrink toward mins, proportional to each segment's shrinkable room.
    const room = specs.map((s, i) => dur[i] - s.min)
    const roomTotal = room.reduce((a, b) => a + b, 0)
    const excess = Math.min(sum() - budgetMs, roomTotal)
    if (roomTotal > 0)
      specs.forEach((_, i) => (dur[i] -= (excess * room[i]) / roomTotal))
    // Anything still over budget is a deliberate overrun (all segments at min).
  } else {
    // Flexbox-style grow: distribute leftover by weight, freezing at max.
    let leftover = budgetMs - sum()
    let active = specs.map((_, i) => i).filter((i) => specs[i].grow > 0)

    while (leftover > EPS && active.length > 0) {
      const growTotal = active.reduce((a, i) => a + specs[i].grow, 0)
      const next: number[] = []
      let distributed = 0

      for (const i of active) {
        const share = (leftover * specs[i].grow) / growTotal
        const headroom = specs[i].max - dur[i]
        const add = Math.min(share, headroom)
        dur[i] += add
        distributed += add
        if (headroom - add > EPS) next.push(i)
      }

      leftover -= distributed
      active = next
      if (distributed <= EPS) break
    }
  }

  // Integer boundaries via cumulative rounding, so durations sum exactly.
  const bounds = [0]
  let acc = 0
  for (const d of dur) {
    acc += d
    bounds.push(Math.round(acc))
  }

  const segments = specs.map((spec, i) => ({
    spec,
    start: bounds[i],
    duration: bounds[i + 1] - bounds[i],
  }))

  return {
    tierName,
    budget: budgetMs,
    total: bounds[bounds.length - 1],
    segments,
  }
}
```

### 4.3 `plan/tiers.ts` — selection and the editorial layer

```ts
export const tierThreshold = (t: TimelineTier, data: PlanInputs) =>
  t.minBudget ?? minDuration(t.build(data))

/** TIERS are ordered poorest -> richest. */
export function plan(
  rawBudgetMs: number,
  data: PlanInputs,
  tiers: TimelineTier[],
): Plan {
  const budget = Math.max(rawBudgetMs - FADE_TRANSITION_MS, 0)
  const fitting = [...tiers]
    .reverse()
    .find((t) => tierThreshold(t, data) <= budget)
  const tier = fitting ?? tiers[0]
  return allocate(tier.name, tier.build(data), budget)
}
```

**As shipped**, only the tiers whose views already exist are in the array:

```ts
export const INTERMISSION_TIERS: TimelineTier[] = [
  {
    name: "full",
    build: () => [intro(), schedule({ grow: 1, max: Infinity })],
  },
]

export const POSTER_TIERS: TimelineTier[] = [
  { name: "poster", build: () => [poster({ grow: 1, max: Infinity })] },
]
```

`logo-only` and `logo-and-next` are deliberately absent: they need views that do
not exist yet (Phase 4). Selection simply skips what is not in the array, so
until then a very short slot squeezes `full` and overruns. Adding each tier is
one line here plus its view — that is the whole point of the split.

Because the tiers are nested in spirit (`logo-only` ⊂ `logo-and-next` ⊂ `full`),
they share segment constructors — a segment tuned once looks identical in every
tier that uses it.

### 4.4 `plan/segments.tsx` — one constructor per view

Each constructor owns its tuning constants and takes a `Bounds` override
(`grow` / `max` only) so a tier can nominate the segment that absorbs slack.
Constructors do **not** take `PlanInputs`: the views read what they need from
`ScheduleContext`, and an unused parameter would not survive
`noUnusedParameters`. Pass data only once a segment genuinely needs it (Phase 4
`newsPosters` will).

Shipped values (deliberately arbitrary; the Phase 3 panel exists to tune them):

| Segment    | `min` | `basis` | `max`    | `grow` |
| ---------- | ----- | ------- | -------- | ------ |
| `intro`    | 3200  | 3200    | 3200     | 0      |
| `schedule` | 12000 | 20000   | Infinity | 1      |
| `poster`   | 5000  | 10000   | Infinity | 1      |

Phase 4 adds `logoSting` (3200 / 5000 / 10000, grow 0) and `nextProgram`
(8000 / 15000 / Infinity, grow 1) alongside their views.

### 4.5 `plan/resolve.ts`

```ts
export interface ActiveSegment {
  index: number
  spec: SegmentSpec
  time: SegmentTime
}

export function resolve(plan: Plan, t: number): ActiveSegment {
  const ct = clamp(t, 0, plan.total - 1) // past the end: hold the last segment
  let index = plan.segments.findIndex((s) => ct < s.start + s.duration)
  if (index === -1) index = plan.segments.length - 1

  const seg = plan.segments[index]
  const local = ct - seg.start
  const isLast = index === plan.segments.length - 1

  const status: SegmentStatus =
    local < FADE_TRANSITION_MS
      ? "entering"
      : !isLast && seg.duration - local <= FADE_TRANSITION_MS
        ? "exiting"
        : "entered"

  return {
    index,
    spec: seg.spec,
    time: { t: local, duration: seg.duration, status },
  }
}
```

### 4.6 `plan/scenarios.ts`

Pure, though only the dev panel consumes it — so test it here. For each tier
emit: its threshold (`"full · 15.7 s (min)"`), the midpoint to the next tier's
threshold, and 1 s below the next threshold (maximum stretch — the worst case
for elastic segments). For the richest tier: threshold, 90 s, 5 min. Dedupe and
sort ascending.

Two details that are easy to get wrong, both covered by tests:

- Scenarios emit **raw** budgets, with `FADE_TRANSITION_MS` added back on, so
  that feeding one to `plan()` selects the tier named in its label.
- Every emitted budget is floored at its own tier's threshold. Without that,
  two tiers less than a second apart would produce a "stretched" budget for the
  lower tier that actually selects the tier below it.

### 4.7 Tests (`*.test.ts` beside each source)

**allocate** — exact-fit rigid tier; grow split by weights; `max` clamp
redistributes to remaining growers; proportional shrink toward mins; overrun
when below the sum of mins; cumulative rounding sums exactly to `total`; a tier
without an unbounded grower throws.

**tiers** — richest fitting tier wins; a budget exactly at a threshold selects
that tier; below the poorest threshold selects the poorest, squeezed;
`minBudget` override is respected; the fade reserve is applied.

**resolve** — `t = 0` is `entering`; `boundary - FADE` is `exiting`; the last
segment never reports `exiting`; `t > total` holds the last segment in
`entered`.

**scenarios** — the emitted budgets bracket every threshold.

Synthetic segments and tiers live in `plan/fixtures.ts`. The tests assert
against those rather than the real tuning values, so retuning a segment does
not break the suite — only the two "shipped tiers" cases touch the real ones,
and they assert structure rather than exact lengths.

**Done — verified.** 36 tests pass, `yarn lint` and `tsc` are clean, and no
existing source file was modified. Changed: `package.json`, `yarn.lock`, plus
new `vitest.config.ts` and `src/sequencing/plan/`.

**Install note.** `yarn add -D vitest` fails on yarn 1.22 with
`Invariant Violation: could not find a copy of vite to link`: vitest 4 accepts
vite `^6 || ^7 || ^8`, so yarn resolves a second, nested vite 8 alongside the
app's vite 7 and then fails to link it — leaving `node_modules/.bin` unwritten
and the tree unusable until reinstalled. Fixed by pinning one copy in
`package.json`, which is desirable anyway since the tests then run on the same
vite as the app:

```json
"resolutions": { "vite": "^7.3.6" }
```

**This pin is temporary — remove it when the app moves to vite 8.** It exists
only because the app was on vite 7 while vitest wanted vite 8; once both are on
8 there is a single copy again and the `resolutions` entry is dead weight.
Delete it, run `yarn install`, and check that `node_modules/.bin` still exists
and `yarn test` passes — that is the whole verification.

---

## 5. Phase 2 — playhead and Player

### 5.1 `src/sequencing/clock/playhead.ts`

A plain external store read through `useSyncExternalStore`, **not** React state:
a per-frame `setState` would re-render the tree at 60 fps for nothing, since the
views animate via CSS.

```ts
export interface Playhead {
  now(): number // current t in ms; readable at any time
  playing: boolean
  seek(t: number): void
  pause(): void
  resume(): void
  restart(): void
  subscribe(cb: () => void): () => void // control changes and rAF ticks
}
```

Implementation: hold an anchor pair (`baseT`, `baseWall = performance.now()`);
`now()` returns `playing ? baseT + (performance.now() - baseWall) : baseT`. A
rAF loop runs while playing and notifies subscribers each frame.

`usePlayheadSelector(playhead, plan, selector)` subscribes but re-renders only
when the selected value changes. **The Player selects `(index, status)`**, so it
re-renders only at segment boundaries and fade edges. The dev timeline runs its
own rAF and paints from `now()` through a ref, staying outside React state
entirely.

Production wiring: the playhead is created when `app.state` becomes `"active"`
and abandoned on `"exit"`. Nothing calls `seek`/`pause` on air.

### 5.2 `src/sequencing/Player.tsx` — replaces `ViewSequence.tsx`

```tsx
export function Player({ plan, playhead }: { plan: Plan; playhead: Playhead }) {
  const { index, spec, time } =
    usePlayheadSelector(/* (index, status) selector */)
  // Outer div keeps ViewSequence's current Tailwind classes (overlay gradient,
  // keyed handling); overlay = spec.overlay !== false && app.state === "active".
  // Inner: <div key={`${plan.tierName}:${index}`} className="absolute inset-0">
  //          {spec.render(time)}
  //        </div>
}
```

### 5.3 Deletions

- `sequencing/components/ViewSequence.tsx`
- `schedule/helpers/getIntermissionSequence.ts`
- `INTRO_VIEW_SEQUENCE_ENTRY` (IntroView exports only the component; its
  duration moves to `plan/segments.tsx`)
- `core/helpers/delay.ts` and `core/helpers/wait.ts` if then unreferenced
- `react-transition-group` from the sequencing path — check remaining
  `TransitionStatus` imports in views, replace with `SegmentStatus`, and drop
  the dependency entirely if nothing else uses it

### 5.4 Wiring changes

- `AppContext` becomes `{ state, keyed, budget }`. `duration` and the
  `Math.max` floor go; `MINIMUM_SCREEN_TIME` is deleted from `constants.ts`.
- `Content` reads `ScheduleContext` (already in place) to build `PlanInputs`.
- `Content.tsx`:

  ```ts
  const p = useMemo(
    () =>
      plan(
        budget,
        { schedule },
        sequence === "poster" ? POSTER_TIERS : INTERMISSION_TIERS,
      ),
    [budget, schedule, sequence],
  )
  ```

  then renders `<Player plan={p} playhead={playhead} />`.

- Views (`ScheduleView`, `PosterView`, `IntroView`) change only their prop type:
  `TransitionStatus` → `SegmentStatus`. The string values are compatible with
  the existing `classNames` logic; the `"exited" | "unmounted"` branches
  disappear.
- **Do not add a group-level opacity fade.** `Content.tsx` carries a comment
  explaining why: an ancestor below `opacity: 1` becomes a backdrop root, which
  cuts the cards' `backdrop-filter` off from what it is meant to blur and
  flattens them for the duration of the fade. Each view fades itself.

**Done — verified in a browser**, not just in tests: the intro plays, both
views are on screen together through the handover, the schedule settles and
holds, and `?sequence=poster` is unchanged. No chained delays remain.

### 5.5 Correction: a flat fade window was wrong

The locked decision said `entering` and `exiting` each last
`FADE_TRANSITION_MS`. Reality in `index.css` says otherwise:

| Animation                 | Length                 |
| ------------------------- | ---------------------- |
| `logo-unblur`             | 1200 ms + 200 ms delay |
| `schedule-in` / `-out`    | 1000 ms + 100 ms delay |
| `card-fall` / `logo-fall` | 700 ms                 |
| `poster-in` / `-out`      | 500 ms                 |

The views hang their keyframes off the status, so holding `entering` for only
500 ms would drop the class a third of the way into the logo's 1400 ms
entrance, abandoning the animation and snapping the element to its rest state.

Worse, a flat window implied the exit had to fit _inside_ the segment's own
allocation, which would have serialised the handover: the intro finishing its
fall on an otherwise empty screen before the schedule began to arrive. Today's
`TransitionGroup` deliberately overlaps them — the card falls away _to reveal_
the schedule already sliding in.

So `SegmentSpec` gained two fields, `enter` and `exit`, and each segment
declares what its own animations actually need. `resolve()` returns a **list**:
normally one segment, and two through a handover, the outgoing one carrying
`status: "exiting"` while the incoming one enters beneath it. The numbers in
`segments.tsx` are read off `index.css` and have to stay in step with it.

---

## 6. Phase 3 — dev panel: scenarios, timeline, scrubber

All within `DevPanel.tsx` plus a new `src/core/components/dev/Timeline.tsx`.
Dev-only; the existing `import.meta.env.DEV` gate in `App.tsx` keeps it out of
the production path.

1. **Budget override.** `DevPanel` owns a `budget` state (initialised from the
   URL param) and passes it to `Content`, overriding the param.
2. **Scenario buttons.** Generated from `scenarios(INTERMISSION_TIERS, data)`;
   clicking sets the budget, re-plans, and calls `restart()`. Keep the existing
   RESET / PLAY / STOP buttons — they simulate CasparCG.
3. **Timeline strip.** One horizontal bar; segments as proportional blocks
   labelled with name and duration in seconds (min-width so tiny ones stay
   legible). Header shows `tierName · budget → total` in seconds, highlighting
   any overrun. The playhead is an absolutely positioned line with its own rAF,
   painting from `playhead.now()` through a ref — no React state per frame.
4. **Transport.** Click and drag on the strip calls
   `seek(fraction * plan.total)`; a pause/resume button; ±500 ms step buttons.

This one panel serves both concerns: the strip evaluates _scheduling choices_
before you press play, and scrubbing evaluates _rendering_.

**Done — verified in a browser.** The scenarios derive to
`full · 15.7 s (min)`, `full · 90 s`, `full · 300 s`; picking 90 s re-plans to
`intro 3.2s | schedule 86.3s`; scrubbing to 1% and 2% lands on the intro and 5%
on the schedule; and `?duration=6000` shows `budget 5.5s → planned 15.2s,
overruns by 9.7s` with both segments at their minimums.

Two things worth knowing when using it:

- **Scrubbing replays the entrance animation** of whatever it lands on, so the
  view takes up to its `enter` to settle into its resting look. That is the
  accepted scrub-fidelity trade-off: the segment and the timing are exact, the
  animation phase is not. Landing mid-plan and waiting a beat shows the true
  resting frame.
- **The budget override lives in `DevPanel`**, which re-provides `AppContext`
  to everything below it. So the panel itself cannot read the overridden
  budget — that is why it is split into `DevPanel` (owns the state, provides
  the context) and `DevPanelBody` (reads it back).

---

## 7. Phase 4 — content

**Done — verified in a browser.** Each item was what the architecture promised:
a view, a segment constructor, a line in a tier's `build`.

The ladder, poorest to richest, with the raw `?duration=` that selects it:

| Tier                 | From   | Composition                                     |
| -------------------- | ------ | ----------------------------------------------- |
| `logo-only`          | 3.7 s  | logo sting                                      |
| `logo-and-next`      | 11.7 s | logo + what is on next                          |
| `schedule`           | 15.7 s | intro + full schedule                           |
| `schedule-and-slate` | 21.7 s | + who the channel is, last                      |
| `full`               | 36.7 s | + three channel news bulletins before the slate |

Every threshold is derived from the segments' minimums, so retuning one moves
the boundary and the dev panel's scenario buttons with it.

**The schedule carries `grow` in every tier that has it**, so a surplus
lengthens the schedule rather than holding a closing beat longer: at 180 s the
schedule takes 146.3 s while the news posters stay at 8 s each and the slate at
6 s.

### Two things left deliberately

- **The copy is placeholder** in `news/bulletins.ts` and `OrgSlateView`, both
  marked as such in the source. It needs editorial sign-off before it airs.
- **`useNews` is the seam.** The bulletins are a hard-coded array today; the
  real feed will come from the same backend as the schedule, and when it does
  only that hook changes — into a fetch and a context, the way `useSchedule`
  already works. `PlanInputs` already carries `news`, so nothing downstream
  moves.

`MAX_NEWS_POSTERS` caps how many bulletins are ever planned. Without it a long
feed would push the `full` tier's threshold past any real budget, and the
effect would be that no news ever aired — a failure that would look like the
tier simply never being chosen.

---

## 8. Execution notes

- Phases 1 → 2 → 3 are strictly ordered; Phase 4 floats.
- Phase 1 touches no existing behaviour — land and review it separately.
- Where numbers feel arbitrary (segment `basis` values), they are. Use the
  stated defaults; they are tunable through the Phase 3 panel by design.
- Do not reintroduce `setTimeout` or `delay` chains anywhere in sequencing. All
  timing flows from `playhead.now()`.

### Open questions (none block Phases 1–3)

1. What is the content source for channel news posters?
2. Should `logo-and-next` ship before `NextProgramView` is designed? Until it
   exists, simply leave the tier out of the array — selection skips it
   automatically.
