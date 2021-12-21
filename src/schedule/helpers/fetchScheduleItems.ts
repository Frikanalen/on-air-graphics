import { api } from "../../core/network"
import { ApiCollection } from "../../core/types"
import { ScheduleItem } from "../types"

export const fetchSceduleItems = async () => {
  const { data } = await api.get<ScheduleItem[]>("/scheduling/entries")

  return data
}
