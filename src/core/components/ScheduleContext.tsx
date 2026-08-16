import { createContext } from "react"
import { type ScheduleItem } from "../../schedule/types"

/*
 * The schedule is fetched once, in App, which holds the loading screen until
 * it arrives. Views read it from here rather than calling useSchedule again:
 * a second call is a second request, and it would hand the view an empty array
 * on its first render, so the cards would paint blank until it resolved.
 */
export const ScheduleContext = createContext<ScheduleItem[]>([])
