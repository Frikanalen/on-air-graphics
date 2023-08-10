import { PhaseOfDay } from "../types"
import * as themes from "../../core/theming"
import { Theme } from "@emotion/react"

const themeMap: Record<PhaseOfDay, Theme> = {
  sunrise: themes.lightTheme,
  noon: themes.lightTheme,
  sunset: themes.lightTheme,
  dusk: themes.darkTheme,
  night: themes.darkTheme,
  dawn: themes.darkTheme,
}

export const getTheme = (time: PhaseOfDay) => themeMap[time]
