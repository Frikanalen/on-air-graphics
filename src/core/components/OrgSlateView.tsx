import { Logo } from "./Logo"
import { type SegmentStatus } from "../../sequencing/plan/types"
export interface OrgSlateViewProps {
  status: SegmentStatus
}
// Channel introduction shown before the schedule in longer gaps.
export function OrgSlateView({ status }: OrgSlateViewProps) {
  return (
    <div className="org-slate" data-status={status}>
      <Logo wordmarkOnly className="slate-wordmark" />
      <div className="slate-copy">
        <h1>Dette er Frikanalen</h1>
        <p>
          Frikanalen er en åpen TV-kanal der medlemsorganisasjoner sender sitt
          eget innhold. Alt innhold sendes på medlemmers eget ansvar.
        </p>
      </div>
    </div>
  )
}
