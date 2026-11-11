import { type SegmentStatus } from "../../sequencing/plan/types"
import { ScheduleView } from "./ScheduleView"
export interface NextProgramViewProps {
  status: SegmentStatus
}
export const NextProgramView = (props: NextProgramViewProps) => (
  <ScheduleView {...props} nextOnly />
)
