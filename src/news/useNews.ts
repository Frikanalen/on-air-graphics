import { BULLETINS } from "./bulletins"
import { type NewsBulletin } from "./types"

/**
 * The channel news the planner may make room for.
 *
 * This is the seam. The bulletins are hard-coded placeholders today; when the
 * backend grows an endpoint for them this becomes a fetch and a context, the
 * way the schedule already works, and nothing else has to move.
 */
export const useNews = (): NewsBulletin[] => BULLETINS
