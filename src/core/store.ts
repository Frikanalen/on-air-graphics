import { fetchSceduleItems } from "../schedule/helpers/fetchScheduleItems"
import { ScheduleItem } from "../schedule/types"

// A simple store that ensures data is present before rendering
class Store {
  public scheduleItems: ScheduleItem[] = []

  public async init() {
    this.scheduleItems = await fetchSceduleItems()
  }
}

export const store = new Store()
