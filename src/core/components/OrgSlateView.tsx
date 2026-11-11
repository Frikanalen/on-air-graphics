import { Logo } from "./Logo"
import { type SegmentStatus } from "../../sequencing/plan/types"
import { MEMBER_HEADING, MEMBER_PAGES } from "../memberMessage"
export interface OrgSlateViewProps {
  status: SegmentStatus
}
export function OrgSlateView({ status }: OrgSlateViewProps) {
  return (
    <div className="org-slate" data-status={status}>
      <Logo wordmarkOnly className="slate-wordmark" />
      {MEMBER_PAGES.map((page, index) => (
        <div
          className="slate-copy slate-page"
          data-page={index}
          key={index}
          style={{ opacity: index === 0 ? 1 : 0 }}
        >
          <h1>{MEMBER_HEADING}</h1>
          <p>{page.text}</p>
          <div className="slate-page-number">
            {index + 1} / {MEMBER_PAGES.length}
          </div>
        </div>
      ))}
    </div>
  )
}
