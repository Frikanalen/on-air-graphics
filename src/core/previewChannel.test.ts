import { describe, expect, it } from "vitest"
import { previewFrom } from "./previewChannel"

describe("what an editor posts to its preview frame", () => {
  it("is read field by field", () => {
    expect(
      previewFrom({
        type: "fk-preview",
        heading: "Hei",
        text: "En\n\nTo",
        template: "notice",
        slide: 1,
      }),
    ).toEqual({
      heading: "Hei",
      text: "En\n\nTo",
      template: "notice",
      slide: 1,
      look: undefined,
      from: undefined,
    })
  })

  it("ignores other messages and fields of the wrong kind", () => {
    expect(previewFrom("fk-preview")).toBeNull()
    expect(previewFrom({ type: "something-else", heading: "Hei" })).toBeNull()
    expect(
      previewFrom({ type: "fk-preview", heading: 5, slide: "1" }),
    ).toMatchObject({ heading: undefined, slide: undefined })
  })
})
