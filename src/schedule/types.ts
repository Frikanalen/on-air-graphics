export type Organization = {
  id: number
  name: string
}

export type Video = {
  id: number
  name: string
  description?: string | null
  organization: Organization
}

export type ScheduleItem = {
  id: number
  /** Null for an airing that has no video, such as a member's text poster. */
  video: Video | null
  starttime: string
  endtime: string
  is_live?: boolean
  /** The airtime grant the airing belongs to, if any. */
  grant?: number | null
}

/** A window of airtime and the organization holding it. */
export type Grant = {
  id: number
  organization: Organization & { fkmember?: boolean }
  /**
   * The station's own airtime (the jukebox, Stortinget): its organization is
   * the channel itself, so there is no holder to name.
   */
  station?: boolean
  starttime: string
  endtime: string
}

/** An airing the schedule view can list. */
export type Programme = ScheduleItem & { video: Video }
