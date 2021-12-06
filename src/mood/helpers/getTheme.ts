import { TimeOfDay } from "../types"
import * as themes from "../../core/theming"
import { Theme } from "@emotion/react"

const themeMap: Record<TimeOfDay, Theme> = {
  sunrise: themes.lightTheme,
  noon: themes.lightTheme,
  sunset: themes.lightTheme,
  dusk: themes.darkTheme,
  night: themes.darkTheme,
  dawn: themes.darkTheme,
}

export const getTheme = (time: TimeOfDay) => themeMap[time]
