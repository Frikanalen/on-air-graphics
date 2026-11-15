import { type Programme } from "../types"
import { formatTime } from "../../graphics/time"
export interface ScheduleItemSummaryProps {
  item: Programme
  next?: boolean
  /** Adds how long the programme is and what it is about. */
  detailed?: boolean
}

const minutes = (item: Programme) =>
  Math.round((Date.parse(item.endtime) - Date.parse(item.starttime)) / 60000)

export function ScheduleItemSummary({
  item,
  next = false,
  detailed = false,
}: ScheduleItemSummaryProps) {
  const description = item.video.description?.replace(/\s+/g, " ").trim()
  return (
    <div className={next ? "next-row" : "later-row"}>
      <time dateTime={item.starttime}>
        {formatTime(Date.parse(item.starttime))}
      </time>
      <div className="programme-info">
        <h2>{item.video.name}</h2>
        <div className="organisation">
          {item.video.organization.name}
          {detailed && minutes(item) > 0 && ` · ${minutes(item)} min`}
        </div>
        {detailed && description && (
          <p className="next-description">{description}</p>
        )}
      </div>
    </div>
  )
}
