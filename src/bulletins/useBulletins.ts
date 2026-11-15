import { useEffect, useState } from "react"
import { api } from "../core/network"
import { type ApiCollection } from "../core/types"
import { frameClock } from "../graphics/time"
import { inTurn } from "./slate"
import { type Bulletin } from "./types"

/** The graphics go on air without bulletins rather than wait for them. */
const TIMEOUT_MS = 4000

/**
 * The bulletins running on air now, in the order they take their turn. They
 * are fetched once: playout loads the graphics afresh for each gap. A fetch
 * that fails or is slow means a gap without bulletins, never a late one.
 */
export const useBulletins = () => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let current = true
    api
      .get<ApiCollection<Bulletin>>("/news/bulletins", {
        params: { placement: "air" },
        timeout: TIMEOUT_MS,
        headers: { "Cache-Control": "no-cache" },
      })
      .then(({ data }) => {
        if (current) setBulletins(inTurn(data.results, frameClock.now()))
      })
      .catch((error) => console.error("bulletins: could not load", error))
      .finally(() => {
        if (current) setLoading(false)
      })
    return () => {
      current = false
    }
  }, [])

  return { bulletins, loading }
}
