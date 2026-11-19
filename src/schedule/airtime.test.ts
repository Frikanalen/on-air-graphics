import { describe, expect, it } from "vitest"
import { holderAt, upcoming } from "./airtime"
import { type Grant, type Programme } from "./types"

const at = (time: string) => `2026-11-19T${time}:00+01:00`
const grant = (id: number, from: string, to: string): Grant => ({
  id,
  organization: { id, name: `Org ${id}`, fkmember: true },
  starttime: at(from),
  endtime: at(to),
})
const programme = (id: number, from: string, grant: number | null) =>
  ({
    id,
    starttime: at(from),
    endtime: at(from),
    grant,
    video: { id, name: `P${id}`, organization: { id: 1, name: "Org" } },
  }) as Programme

describe("airtime", () => {
  const grants = [grant(1, "19:00", "20:30"), grant(2, "20:30", "21:00")]

  it("finds whose airtime a moment is in", () => {
    expect(holderAt(grants, Date.parse(at("20:29")))?.id).toBe(1)
    expect(holderAt(grants, Date.parse(at("20:30")))?.id).toBe(2)
    expect(holderAt(grants, Date.parse(at("21:00")))).toBeUndefined()
  })

  it("lists airtime without programmes among the later programmes", () => {
    const next = programme(10, "19:45", 1)
    const later = [programme(11, "21:00", 3)]
    const entries = upcoming(
      later,
      [next, ...later],
      [...grants, grant(3, "21:00", "22:00")],
      Date.parse(next.starttime),
    )
    // Grant 1 has a programme and has started; grant 3 has one; grant 2 is open.
    expect(
      entries.map((e) => ("airtime" in e ? `airtime ${e.airtime.id}` : e.id)),
    ).toEqual(["airtime 2", 11])
  })
})
