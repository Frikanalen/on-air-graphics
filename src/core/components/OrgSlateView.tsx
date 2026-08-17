import classNames from "classnames"
import { type SegmentStatus } from "../../sequencing/plan/types"

export interface OrgSlateViewProps {
  status: SegmentStatus
}

/*
 * PLACEHOLDER COPY -- needs editorial sign-off before it airs. The shape is
 * right; the words are a stand-in.
 */
const HEADING = "Dette er Frikanalen"
const BODY =
  "Frikanalen er en åpen TV-kanal der medlemsorganisasjoner sender sitt eget innhold. Alt innhold sendes på medlemmers eget ansvar."

/**
 * The last thing before the video starts: who this channel is. Rigid on
 * purpose -- it is a closing beat, and stretching it would only leave the
 * viewer reading the same two sentences for longer.
 *
 * Sits in the content column and draws no mark of its own: the station clock
 * is carrying one for as long as this view is up.
 */
export function OrgSlateView(props: OrgSlateViewProps) {
  const { status } = props
  const exiting = status === "exiting"

  return (
    <div className="flex h-full flex-col p-16">
      <div className="relative z-10 flex flex-1 items-center">
        <div className="max-w-[590px] flex-1">
          <h1
            className={classNames(
              "text-normal",
              exiting ? "animate-title-out" : "animate-title-in",
            )}
          >
            {HEADING}
          </h1>

          <div
            className={classNames(
              "card mt-6 p-6",
              exiting ? "animate-schedule-out" : "animate-schedule-in",
            )}
          >
            {/* leading-snug because text-body's 0.75 laps wrapped lines. */}
            <p className="text-body leading-snug text-normal">{BODY}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
