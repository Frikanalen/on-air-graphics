import { Logo } from "./Logo"
import { type SegmentStatus } from "../../sequencing/plan/types"
export type IntroView = { status: SegmentStatus }
export const IntroView = ({ status }: IntroView) => (
  <div data-status={status}>
    <Logo wordmarkOnly className="wide-wordmark" />
  </div>
)
