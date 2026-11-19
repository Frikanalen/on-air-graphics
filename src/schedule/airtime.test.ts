import { describe, expect, it } from "vitest"
import { handoverTo, holderAt, stretchOf, upcoming } from "./airtime"
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

describe("handoverTo", () => {
  const grants = [grant(1, "19:00", "20:30"), grant(2, "20:30", "21:00")]
  const now = (time: string) => Date.parse(at(time))

  it("names the airtime a gap leads into", () => {
    // From nobody's time into a window, and from one holder's to the next's.
    expect(handoverTo(programme(1, "19:00", 1), grants, now("18:59"))?.id).toBe(
      1,
    )
    expect(handoverTo(programme(2, "20:30", 2), grants, now("20:29"))?.id).toBe(
      2,
    )
  })
  it("is nothing inside the holder's own airtime", () => {
    expect(
      handoverTo(programme(1, "19:45", 1), grants, now("19:40")),
    ).toBeUndefined()
  })
  it("is nothing between two windows of the same holder", () => {
    const same = [
      grants[0],
      { ...grant(3, "20:30", "21:00"), organization: grants[0].organization },
    ]
    expect(
      handoverTo(programme(2, "20:30", 3), same, now("20:29")),
    ).toBeUndefined()
  })
  it("is nothing before a programme outside any airtime", () => {
    expect(
      handoverTo(programme(1, "18:00", null), grants, now("17:59")),
    ).toBeUndefined()
    expect(handoverTo(undefined, grants, now("17:59"))).toBeUndefined()
  })
})

describe("stretchOf", () => {
  it("says a round length in words and any other by its end", () => {
    expect(stretchOf(grant(1, "21:30", "22:00"))).toBe("Den neste halvtimen")
    expect(stretchOf(grant(1, "19:00", "20:00"))).toBe("Den neste timen")
    expect(stretchOf(grant(1, "19:00", "20:30"))).toBe("De neste 90 minuttene")
    expect(stretchOf(grant(1, "19:00", "21:00"))).toBe("De neste to timene")
    expect(stretchOf(grant(1, "10:00", "22:00"))).toBe("De neste tolv timene")
    expect(stretchOf(grant(1, "10:00", "15:40"))).toBe(
      "Sendetiden fram til 15:40",
    )
  })
})
