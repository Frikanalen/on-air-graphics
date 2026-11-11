import { type ScheduleItem } from "../types"
import { formatTime } from "../../graphics/time"
export interface ScheduleItemSummaryProps {
  item: ScheduleItem
  next?: boolean
}
export function ScheduleItemSummary({
  item,
  next = false,
}: ScheduleItemSummaryProps) {
  return (
    <div className={next ? "next-row" : "later-row"}>
      <time dateTime={item.starttime}>
        {formatTime(Date.parse(item.starttime))}
      </time>
      <div className="programme-info">
        <h2>{item.video.name}</h2>
        <div className="organisation">{item.video.organization.name}</div>
      </div>
    </div>
  )
}
