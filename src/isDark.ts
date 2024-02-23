import { getPhaseOfDay } from "./mood/helpers/getPhaseOfDay.ts"
import { OSLO_COORDINATES } from "./mood/constants.ts"

export const isDark = ["sunset", "dusk", "night"].includes(
  getPhaseOfDay(new Date(), ...OSLO_COORDINATES),
)
