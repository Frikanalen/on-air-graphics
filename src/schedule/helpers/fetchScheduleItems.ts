import { api } from "../../core/network"
import { ApiCollection } from "../../core/types"
import { Grant, ScheduleItem } from "../types"

/*
 * The endpoint returns the schedule from the start of the day and pages it at
 * fifty, while the views show only what is still to come. So the useful part of
 * the response shrinks as the day goes on: by late afternoon nearly all fifty
 * are in the past, "Senere" empties out, and by the evening there is nothing
 * left to show at all -- the graphics look broken when the schedule is fine.
 *
 * Asking for a page big enough to cover a whole day is a workaround. The fix
 * belongs on the server, which should be filtering to what is upcoming rather
 * than making the client ask for everything and discard most of it.
 */
const PAGE_SIZE = 500

/*
 * The API lets browsers keep the schedule for minutes, which suits the public
 * site. The graphics fetch it because playout events say it just changed, so
 * a cached copy is exactly the wrong answer: make the browser ask the server.
 */
const FRESH = { "Cache-Control": "no-cache" }

export const fetchSceduleItems = async () => {
  const { data } = await api.get<ApiCollection<ScheduleItem>>(
    "/scheduleitems",
    {
      params: {
        ordering: "starttime",
        limit: PAGE_SIZE,
      },
      headers: FRESH,
    },
  )

  return data.results
}

/**
 * Whose airtime today and tomorrow is. The views work without it, so an API
 * that cannot answer costs only the lines that name the holder.
 */
export const fetchGrants = async () => {
  try {
    const { data } = await api.get<Grant[]>("/grants/public", {
      params: { days: 2 },
      headers: FRESH,
      // The schedule waits for this answer, so it does not wait long.
      timeout: 5000,
    })
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
