import { Logo } from "./Logo"
import { MusicCredit } from "./MusicCredit"

export interface UnavailableViewProps {
  /** The programme's title, or empty when several in a row are missing. */
  title: string
}

const HEADING = "Programmet er ikke tilgjengelig"
const BODY =
  "Programmet som skulle gå nå, har ikke kommet fram til oss. Vi beklager."

/**
 * Shown by playout for the length of a scheduled programme whose file never
 * arrived, in place of the programme. It holds still for the whole slot: it
 * is a notice, not a sequence.
 */
export function UnavailableView(props: UnavailableViewProps) {
  const { title } = props

  return (
    <div className="unavailable-notice">
      <div className="unavailable-copy">
        <div className="unavailable-body">
          <Logo className="unavailable-logo" />
          <h1>{HEADING}</h1>
          <div>
            {title && <p className="unavailable-title">{title}</p>}
            <p>{BODY}</p>
          </div>
        </div>
      </div>
      <MusicCredit light />
    </div>
  )
}
