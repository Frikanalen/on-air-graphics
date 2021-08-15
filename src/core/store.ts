import { fetchSceduleItems } from "../schedule/helpers/fetchScheduleItems"
import { ScheduleItem } from "../schedule/types"
import { TimeOfDay } from "./types"

// A simple store that ensures data is present before rendering
class Store {
  public timeOfDay: TimeOfDay = "day"
  public scheduleItems: ScheduleItem[] = []

  public async init() {
    this.scheduleItems = await fetchSceduleItems()
  }

  public get safeScheduleItems() {
    return this.scheduleItems.filter((x) => new Date() < new Date(x.endtime))
  }
}

export const store = new Store()
