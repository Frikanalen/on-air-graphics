import { clamp, lerp, mixColor } from "./color"

const rad = Math.PI / 180
/** NOAA Julian-century solar position, geometric elevation (no refraction).
 * https://gml.noaa.gov/grad/solcalc/main.js */
export function sunElevation(timestamp: number): number {
  const t = (timestamp / 86400000 + 2440587.5 - 2451545) / 36525
  const lon = (280.46646 + t * (36000.76983 + 0.0003032 * t)) * rad
  const anomaly = (357.52911 + t * (35999.05029 - 0.0001537 * t)) * rad
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t)
  const center =
    Math.sin(anomaly) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * anomaly) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * anomaly) * 0.000289
  const omega = (125.04 - 1934.136 * t) * rad
  const apparent = lon + (center - 0.00569 - 0.00478 * Math.sin(omega)) * rad
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - 0.001813 * t))
  const obliquity =
    (23 + (26 + seconds / 60) / 60 + 0.00256 * Math.cos(omega)) * rad
  const decl = Math.asin(Math.sin(obliquity) * Math.sin(apparent))
  const y = Math.tan(obliquity / 2) ** 2
  const eq =
    (4 / rad) *
    (y * Math.sin(2 * lon) -
      2 * e * Math.sin(anomaly) +
      4 * e * y * Math.sin(anomaly) * Math.cos(2 * lon) -
      0.5 * y * y * Math.sin(4 * lon) -
      1.25 * e * e * Math.sin(2 * anomaly))
  const date = new Date(timestamp)
  const minutes =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60 +
    date.getUTCMilliseconds() / 60000
  const ha = ((minutes + eq + 4 * 10.7522) / 4 - 180) * rad
  return (
    Math.asin(
      Math.sin(59.9139 * rad) * Math.sin(decl) +
        Math.cos(59.9139 * rad) * Math.cos(decl) * Math.cos(ha),
    ) / rad
  )
}

export interface LightState {
  stops: [string, string, string]
  x: number
  y: number
  shadow: string
  opacity: number
  tight: number
  wide: number
  skew: number
  tx: number
  ty: number
  scale: number
}
export const LIGHTS: LightState[] = [
  {
    stops: ["#1D2D45", "#131F30", "#0A111B"],
    x: 22,
    y: 18,
    shadow: "#050A12",
    opacity: 0.5,
    tight: 16,
    wide: 50,
    skew: -10,
    tx: 700,
    ty: -190,
    scale: 26,
  },
  {
    stops: ["#5A3368", "#33204A", "#150F24"],
    x: 6,
    y: 62,
    shadow: "#0C0818",
    opacity: 0.55,
    tight: 14,
    wide: 48,
    skew: -22,
    tx: 560,
    ty: -250,
    scale: 30,
  },
  {
    stops: ["#8E4338", "#5E2740", "#28122A"],
    x: 8,
    y: 48,
    shadow: "#1A0A1C",
    opacity: 0.58,
    tight: 10,
    wide: 40,
    skew: -18,
    tx: 600,
    ty: -230,
    scale: 29,
  },
  {
    stops: ["#197061", "#0F5046", "#082C2C"],
    x: 50,
    y: 2,
    shadow: "#04191B",
    opacity: 0.55,
    tight: 8,
    wide: 34,
    skew: -4,
    tx: 720,
    ty: -170,
    scale: 25,
  },
]
export const PAPER: LightState = {
  stops: ["#FCF8F0", "#F5EFE4", "#E4DAC9"],
  x: 62,
  y: 30,
  shadow: "#2A1B2C",
  opacity: 0.11,
  tight: 50,
  wide: 50,
  skew: 0,
  tx: 668,
  ty: 22,
  scale: 13.4,
}
export const RED: LightState = {
  ...LIGHTS[0],
  stops: ["#EA5A4A", "#B5404A", "#6A2549"],
  shadow: "#3A0F2C",
  tight: 7,
  wide: 36,
}
export function mixLight(a: LightState, b: LightState, t: number): LightState {
  return {
    stops: a.stops.map((c, i) =>
      mixColor(c, b.stops[i], t),
    ) as LightState["stops"],
    shadow: mixColor(a.shadow, b.shadow, t),
    ...Object.fromEntries(
      (
        [
          "x",
          "y",
          "opacity",
          "tight",
          "wide",
          "skew",
          "tx",
          "ty",
          "scale",
        ] as const
      ).map((k) => [k, lerp(a[k], b[k], t)]),
    ),
  } as LightState
}
export function lightAtElevation(elevation: number): LightState {
  const stops = [-8, -3.5, 3, 12]
  const index = stops.findIndex((e) => elevation <= e)
  if (index <= 0) return LIGHTS[index < 0 ? 3 : 0]
  return mixLight(
    LIGHTS[index - 1],
    LIGHTS[index],
    clamp((elevation - stops[index - 1]) / (stops[index] - stops[index - 1])),
  )
}
export const lightAtTime = (timestamp: number) =>
  lightAtElevation(sunElevation(timestamp))
