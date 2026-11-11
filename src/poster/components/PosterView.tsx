import { type SegmentStatus } from "../../sequencing/plan/types"
import { useParams } from "../../core/hooks/useParams"
export interface PosterViewProps {
  transition: SegmentStatus
}
export function PosterView({ transition }: PosterViewProps) {
  const { message, type } = useParams({
    message: "Tekstplakat melding",
    type: "info",
  })
  return (
    <div className="news-column" data-status={transition}>
      <div className="label yellow">
        {type === "warning" ? "Viktig melding" : "Frikanalen"}
      </div>
      <div className="news-copy">
        <h1>{message}</h1>
      </div>
    </div>
  )
}
