import { api } from "../../core/network"
import { ApiCollection } from "../../core/types"
import { ScheduleItem } from "../types"

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

export const fetchSceduleItems = async () => {
  const { data } = await api.get<ApiCollection<ScheduleItem>>(
    "/scheduleitems",
    {
      params: {
        ordering: "starttime",
        limit: PAGE_SIZE,
      },
    },
  )

  return data.results
}
