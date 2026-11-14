import { Logo } from "./Logo"
import { MusicCredit } from "./MusicCredit"

/** The looks a member can pick for a text poster. Django keeps the same list. */
export const MEMBER_POSTER_TEMPLATES = ["paper", "stage", "notice"] as const
export type MemberPosterTemplate = (typeof MEMBER_POSTER_TEMPLATES)[number]

export interface MemberPosterViewProps {
  /** One of MEMBER_POSTER_TEMPLATES; anything else is shown as paper. */
  template: string
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
 * as they listed it: `?poster=<template>&heading=…&text=…&from=…`. Like the
 * unavailable notice it holds still for its whole slot. The music under it
 * is credited, as everywhere the graphics play it.
 */
export function MemberPosterView(props: MemberPosterViewProps) {
  const template = (MEMBER_POSTER_TEMPLATES as readonly string[]).includes(
    props.template,
  )
    ? props.template
    : "paper"
  const light = template === "paper"
  const paragraphs = props.text.split(/\n+/).filter((line) => line.trim())

  return (
    <div
      className="member-poster"
      data-template={template}
      data-size={size(props.heading, props.text)}
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
      {props.from && <p className="member-poster-from">Fra {props.from}</p>}
      <MusicCredit light={light} />
    </div>
  )
}
