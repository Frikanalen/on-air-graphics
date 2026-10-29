import { useState, useEffect } from "react"
import { fetchSceduleItems } from "../schedule/helpers/fetchScheduleItems"
import { type ScheduleItem } from "../schedule/types"
import { api } from "./network"
import { subscribeToScheduleChanges } from "./scheduleUpdates"

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let current = true
    // A refetch that fails keeps the schedule already on screen.
    const refresh = () => {
      fetchSceduleItems()
        .then((schedule) => {
          if (!current) return
          setSchedule(schedule)
          setError(null)
          setLoading(false)
        })
        .catch((error) => {
          if (!current) return
          setError(error)
          setLoading(false)
        })
    }

    refresh()
    const stop = subscribeToScheduleChanges(
      `${api.defaults.baseURL}/playout/events`,
      refresh,
    )
    return () => {
      current = false
      stop()
    }
  }, [])

  return { schedule, loading, error }
}
