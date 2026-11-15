/** A message from the channel, as /api/news/bulletins lists it. */
export interface Bulletin {
  id: number | string
  heading: string
  text: string
  /** "standard" or "notice"; anything else is shown as standard. */
  template: string
  priority?: number
}
