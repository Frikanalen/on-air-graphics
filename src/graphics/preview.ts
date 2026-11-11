import {
  intro,
  logoSting,
  orgSlate,
  schedule,
  nextProgram,
  newsPosters,
  poster,
} from "../sequencing/plan/segments"
import { type Plan } from "../sequencing/plan/types"
import { BULLETINS } from "../news/bulletins"
/** Explicit review mode only; does not change the editorial tier ladder. */
export function previewPlan(): Plan | null {
  const view = new URLSearchParams(window.location.search).get("view")
  const spec =
    view === "intro"
      ? intro()
      : view === "logo"
        ? logoSting()
        : view === "slate"
          ? orgSlate()
          : view === "schedule"
            ? schedule()
            : view === "next"
              ? nextProgram()
              : view === "news"
                ? newsPosters(BULLETINS)[0]
                : view === "poster"
                  ? poster()
                  : null
  return spec
    ? {
        tierName: `preview:${view}`,
        budget: 86400000,
        total: 86400000,
        segments: [{ spec, start: 0, duration: 86400000 }],
      }
    : null
}
