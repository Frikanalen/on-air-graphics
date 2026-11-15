import {
  intro,
  logoSting,
  bulletinSlate,
  schedule,
  nextProgram,
  newsPosters,
  poster,
} from "../sequencing/plan/segments"
import { type Plan } from "../sequencing/plan/types"
import { BULLETINS } from "../news/bulletins"
import { bulletinFromQuery, SAMPLE_BULLETIN } from "../bulletins/slate"
import { type Bulletin } from "../bulletins/types"
import { type PreviewText } from "../core/previewChannel"
/** Explicit review mode only; does not change the editorial tier ladder. */
export function previewPlan(
  bulletins: Bulletin[] = [],
  posted: PreviewText | null = null,
): Plan | null {
  const view = new URLSearchParams(window.location.search).get("view")
  const spec =
    view === "intro"
      ? intro()
      : view === "logo"
        ? logoSting()
        : view === "slate"
          ? bulletinSlate(
              bulletinFromQuery(posted) ?? bulletins[0] ?? SAMPLE_BULLETIN,
            )
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
