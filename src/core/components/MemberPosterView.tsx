import { useContext, useState, useSyncExternalStore } from "react"
import { sunElevation } from "../../graphics/sun"
import { frameClock } from "../../graphics/time"
import { PlayheadContext } from "../../sequencing/clock/PlayheadContext"
import { posterSlides, slideAt } from "../posterSlides"
import { AppContext } from "./AppContext"
import { Logo } from "./Logo"
import { MusicCredit } from "./MusicCredit"

/** The templates a member can pick for a text poster. Django keeps the same list. */
export const MEMBER_POSTER_TEMPLATES = ["standard", "notice"] as const
export type MemberPosterTemplate = (typeof MEMBER_POSTER_TEMPLATES)[number]

/** Light by day, dark by night: the member doesn't choose, the clock does. */
export const MEMBER_POSTER_LOOKS = ["day", "night"] as const
export type MemberPosterLook = (typeof MEMBER_POSTER_LOOKS)[number]

/** Day while the sun is above the horizon in Oslo. */
export const lookAt = (timestamp: number): MemberPosterLook =>
  sunElevation(timestamp) > 0 ? "day" : "night"

export interface MemberPosterViewProps {
  /** One of MEMBER_POSTER_TEMPLATES; anything else is shown as standard. */
  template: string
  /** Forces a look, as the poster editor's previews do. Otherwise the time
   * the poster goes on air decides, and it keeps that look for its slot. */
  look?: string | null
  /** Holds one slide (from 0), as the editor's previews do. Otherwise the
   * slides go round in the time the poster is listed for. */
  slide?: string | null
  heading: string
  text: string
  /** The organization the poster is from. */
  from: string
}

/** Short copy gets larger type, so a two-word poster doesn't look lost. */
const size = (heading: string, text: string) => {
  const length = heading.length + text.length
  if (length <= 60) return "large"
  if (length <= 220) return "medium"
  return "small"
}

/**
 * A member's text poster, which playout airs in their airtime for as long
 * as they listed it: `?poster=<template>&heading=…&text=…&from=…`, with an
 * optional `look=day|night` and `slide=<n>`. A blank line in the text starts
 * a new slide; the slides go round in whole cycles (posterSlides.ts). The music under it
 * is credited, as everywhere the graphics play it.
 */
export function MemberPosterView(props: MemberPosterViewProps) {
  const template = (MEMBER_POSTER_TEMPLATES as readonly string[]).includes(
    props.template,
  )
    ? props.template
    : "standard"
  const [timeOfDay] = useState(() => lookAt(frameClock.now()))
  const look = (MEMBER_POSTER_LOOKS as readonly string[]).includes(
    props.look ?? "",
  )
    ? (props.look as MemberPosterLook)
    : timeOfDay
  const slides = posterSlides(props.text)
  const playhead = useContext(PlayheadContext)
  const { budget } = useContext(AppContext)
  const held = Number.parseInt(props.slide ?? "", 10)
  const running = useSyncExternalStore(playhead.subscribe, () =>
    slideAt(props.heading, props.text, budget, playhead.now()),
  )
  const index = Number.isInteger(held)
    ? Math.min(Math.max(held, 0), slides.length - 1)
    : running
  const slide = slides[index]
  const paragraphs = slide.split(/\n+/).filter((line) => line.trim())

  return (
    <div
      className="member-poster"
      data-template={template}
      data-look={look}
      data-size={size(props.heading, slide)}
    >
      <Logo className="member-poster-logo" />
      <div className="member-poster-copy">
        {template === "notice" && (
          <p className="member-poster-label">Viktig melding</p>
        )}
        <h1>{props.heading}</h1>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="member-poster-corner">
        {props.from && <p>Fra {props.from}</p>}
        {slides.length > 1 && (
          <p className="member-poster-page">
            {index + 1} / {slides.length}
          </p>
        )}
      </div>
      <MusicCredit light={look === "day"} />
    </div>
  )
}
