import { Logo } from "./Logo"

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
    <div className="flex h-full flex-col p-16">
      <div className="relative z-10 flex flex-1 items-center">
        <div className="max-w-[640px] flex-1">
          <Logo className="mb-8 h-12" />
          <h1 className="animate-title-in text-normal">{HEADING}</h1>
          <div className="card animate-schedule-in mt-6 p-6">
            {title && (
              <p className="text-body mb-2 font-bold leading-snug text-normal">
                {title}
              </p>
            )}
            <p className="text-body leading-snug text-normal">{BODY}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
