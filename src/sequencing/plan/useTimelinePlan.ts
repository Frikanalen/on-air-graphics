import { useContext, useMemo } from "react"
import { AppContext } from "../../core/components/AppContext"
import { ScheduleContext } from "../../core/components/ScheduleContext"
import { useSequenceName } from "../../core/hooks/useSequenceName"
import { useNews } from "../../news/useNews"
import { BulletinContext } from "../../bulletins/BulletinContext"
import { usePreviewText } from "../../core/previewChannel"
import { plan, tiersFor } from "./tiers"
import { previewPlan } from "../../graphics/preview"
import { type Plan } from "./types"

/**
 * The timeline for the budget currently on offer.
 *
 * Planning is pure and cheap, so the dev panel calls this alongside the player
 * to draw the strip rather than the two sharing an instance -- given the same
 * budget and schedule it is the same plan either way.
 */
export const useTimelinePlan = (): Plan => {
  const { budget } = useContext(AppContext)
  const schedule = useContext(ScheduleContext)
  const news = useNews()
  const bulletins = useContext(BulletinContext)
  const sequence = useSequenceName()
  const posted = usePreviewText()

  return useMemo(
    () =>
      previewPlan(bulletins, posted) ??
      plan(budget, { schedule, news, bulletins }, tiersFor(sequence)),
    [budget, schedule, news, bulletins, sequence, posted],
  )
}
