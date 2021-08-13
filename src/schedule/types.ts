export type Video = {
  id: number
  name: string
}

export type ScheduleItem = {
  video: Video
  starttime: string
  endtime: string
}
