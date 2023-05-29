import { OSLO_COORDINATES } from "../mood/constants"
import { getTimeOfDay } from "../mood/helpers/getTimeOfDay"
import { fetchSceduleItems } from "../schedule/helpers/fetchScheduleItems"
import { ScheduleItem } from "../schedule/types"

// A simple store that ensures data is present before rendering
class Store {
  public timeOfDay = getTimeOfDay(new Date(), ...OSLO_COORDINATES)
  public scheduleItems: ScheduleItem[] = []

  public async init() {
    this.scheduleItems = await fetchSceduleItems()
  }

  public get safeScheduleItems() {
    return (
      this.scheduleItems?.filter((x) => new Date() < new Date(x.endtime)) ?? []
    )
  }
}

export const store = new Store()
