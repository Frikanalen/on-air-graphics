import { getHours } from "date-fns"
import { fetchSceduleItems } from "../schedule/helpers/fetchScheduleItems"
import { ScheduleItem } from "../schedule/types"
import { TimeOfDay } from "./types"

const hours = getHours(new Date())

// A simple store that ensures data is present before rendering
class Store {
  public timeOfDay: TimeOfDay = hours > 12 && hours < 18 ? "day" : "night"
  public scheduleItems: ScheduleItem[] = []

  public async init() {
    this.scheduleItems = await fetchSceduleItems()
  }

  public get safeScheduleItems() {
    return this.scheduleItems.filter((x) => new Date() < new Date(x.endtime))
  }
}

export const store = new Store()
