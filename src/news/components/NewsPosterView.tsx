import { type SegmentStatus } from "../../sequencing/plan/types"
import { type NewsBulletin } from "../types"
export interface NewsPosterViewProps {
  status: SegmentStatus
  bulletin: NewsBulletin
}
export function NewsPosterView({ bulletin }: NewsPosterViewProps) {
  return (
    <div className="news-column">
      <div className="label yellow">Nytt fra kanalen</div>
      <div className="news-copy">
        <h1>{bulletin.title}</h1>
        <p>{bulletin.body}</p>
      </div>
    </div>
  )
}
