import { differenceInSeconds } from "date-fns"
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
    return this.scheduleItems.filter(
      (x) => differenceInSeconds(new Date(x.endtime), new Date()) > 0
    )
  }
}

export const store = new Store()
