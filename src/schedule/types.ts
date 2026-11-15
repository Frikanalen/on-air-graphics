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
}

/** An airing the schedule view can list. */
export type Programme = ScheduleItem & { video: Video }
