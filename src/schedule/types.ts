export type Organization = {
  id: number
  name: string
}

export type Video = {
  id: number
  title: string
  organization: Organization
}

export type ScheduleItem = {
  type: "jukebox"
  video: Video
  startsAt: string
  endsAt: string
}
