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
        <h2 className="-mt-[7px] mb-[7px] overflow-hidden text-ellipsis whitespace-nowrap text-normal leading-normal">
          {video.name}
        </h2>
        <span className="text-[20px] text-muted leading-[75%]">
          {video.organization.name}
        </span>
      </div>
      <span className="text-[20px] font-semibold text-muted">
        <HumanizedDate date={new Date(starttime)} />
      </span>
    </div>
  )
}
