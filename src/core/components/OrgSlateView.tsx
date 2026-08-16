import classNames from "classnames"
import { Logo } from "./Logo"
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
 */
export function OrgSlateView(props: OrgSlateViewProps) {
  const { status } = props
  const exiting = status === "exiting"

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 p-16">
      <Logo
        className={classNames(
          "w-[480px] text-normal",
          exiting ? "animate-slide-fade-out" : "animate-slide-fade-in",
        )}
      />

      <div
        className={classNames(
          "card relative z-2 max-w-[820px] p-8 text-center",
          exiting ? "animate-poster-out" : "animate-poster-in",
        )}
      >
        <h2 className="text-lead font-medium text-normal">{HEADING}</h2>
        {/*
         * text-body carries a 0.75 line height, which is meant for single-line
         * labels and laps the lines over each other in a paragraph.
         */}
        <p className="mt-3 text-body leading-snug text-muted">{BODY}</p>
      </div>
    </div>
  )
}
