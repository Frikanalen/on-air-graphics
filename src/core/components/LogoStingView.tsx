import { IntroView } from "./IntroView"
import { type SegmentStatus } from "../../sequencing/plan/types"
export interface LogoStingViewProps {
  status: SegmentStatus
}
export const LogoStingView = (props: LogoStingViewProps) => (
  <IntroView {...props} />
)
