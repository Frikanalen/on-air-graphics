import { useState, useEffect } from "react"
import {
  fetchGrants,
  fetchSceduleItems,
} from "../schedule/helpers/fetchScheduleItems"
import { type Grant, type ScheduleItem } from "../schedule/types"
import { api } from "./network"
import { subscribeToScheduleChanges } from "./scheduleUpdates"

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let current = true
    // A refetch that fails keeps the schedule already on screen.
    const refresh = () => {
      Promise.all([fetchSceduleItems(), fetchGrants()])
        .then(([schedule, grants]) => {
          if (!current) return
          setSchedule(schedule)
          setGrants(grants)
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

  return { schedule, grants, loading, error }
}
