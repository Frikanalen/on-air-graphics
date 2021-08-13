import { api } from "../../core/network"
import { ApiCollection } from "../../core/types"
import { ScheduleItem } from "../types"

export const fetchSceduleItems = async () => {
  const { data } = await api.get<ApiCollection<ScheduleItem>>(
    "/scheduleitems",
    {
      params: {
        ordering: "starttime",
      },
    }
  )

  return data.results
}
