import { useState, useEffect } from "react"
import { fetchSceduleItems } from "../schedule/helpers/fetchScheduleItems"
import { type ScheduleItem } from "../schedule/types"

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchSceduleItems()
      .then((schedule) => {
        setSchedule(schedule)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [])

  return { schedule, loading, error }
}
