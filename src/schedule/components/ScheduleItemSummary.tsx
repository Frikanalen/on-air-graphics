import { type ScheduleItem } from "../types"
import { HumanizedDate } from "./HumanizedDate"

export interface ScheduleItemSummaryProps {
  item: ScheduleItem
}

export function ScheduleItemSummary(props: ScheduleItemSummaryProps) {
  const { video, starttime } = props.item

  return (
    <div className="mb-[-5px] flex items-center justify-between">
      <div className="mr-4 w-0 flex-1">
        <h2 className="ellipsis-heading overflow-hidden text-ellipsis whitespace-nowrap text-normal">
          {video.name}
        </h2>
        <span className="text-body text-muted">
          {video.organization.name}
        </span>
      </div>
      <span className="text-body font-semibold text-muted">
        <HumanizedDate date={new Date(starttime)} />
      </span>
    </div>
  )
}
