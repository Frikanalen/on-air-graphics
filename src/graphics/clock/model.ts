import { clamp, lerp } from "../color"
import { osloParts } from "../time"

export const SECOND_KEYS = [
  [-90, 0],
  [0, -0.5],
  [60, 6.4],
  [120, 5.9],
  [180, 6],
]
export const MINUTE_KEYS = [
  [-120, 0],
  [0, -0.4],
  [90, 6.5],
  [190, 5.85],
  [300, 6],
]
export function recoil(keys: number[][], elapsed: number): number {
  if (elapsed <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    if (elapsed <= keys[i][0]) {
      const [t, a] = keys[i - 1],
        [end, b] = keys[i]
      return lerp(
        a,
        b,
        (1 - Math.cos((Math.PI * (elapsed - t)) / (end - t))) / 2,
      )
    }
  }
  return keys[keys.length - 1][1]
}
function stepped(timestamp: number, period: number, keys: number[][]) {
  const boundary = Math.floor(timestamp / period) * period
  const elapsed = timestamp - boundary
  return elapsed >= period + keys[0][0]
    ? { boundary: boundary + period, angle: recoil(keys, elapsed - period) }
    : { boundary, angle: recoil(keys, elapsed) }
}
const digits = (timestamp: number) => {
  const { hour, minute } = osloParts(timestamp)
  return `${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}`
}
export function flapAngle(elapsed: number) {
  if (elapsed <= 0) return 0
  if (elapsed <= 380) return 180 * (elapsed / 380) ** 2
  if (elapsed <= 440) return lerp(180, 172, (elapsed - 380) / 60)
  return lerp(172, 180, clamp((elapsed - 440) / 70))
}
export function clockModel(timestamp: number) {
  const sec = stepped(timestamp, 1000, SECOND_KEYS),
    min = stepped(timestamp, 60000, MINUTE_KEYS)
  const restSec = osloParts(sec.boundary - 1000)
  const restMin = osloParts(min.boundary - 60000)
  const boundary = Math.floor(timestamp / 60000) * 60000
  const old = digits(boundary - 60000),
    next = digits(boundary)
  let rank = 0
  const flaps = [3, 2, 1, 0]
    .map((index) => {
      const changed = old[index] !== next[index]
      const delay = changed ? rank++ * 40 : 0
      const elapsed = timestamp - boundary - delay
      return {
        index,
        old: old[index],
        next: next[index],
        changed,
        delay,
        elapsed,
        angle: changed ? flapAngle(elapsed) : 180,
      }
    })
    .reverse()
  const targetHour = osloParts(min.boundary)
  // Civil-time hour changes take effect at the DST boundary; the small
  // mechanical minute recoil remains identical on either side of it.
  const restingHour =
    timestamp < min.boundary
      ? (restMin.hour % 12) * 30 + restMin.minute * 0.5
      : (targetHour.hour % 12) * 30 + targetHour.minute * 0.5 - 0.5
  return {
    second: restSec.second * 6 + sec.angle,
    minute: restMin.minute * 6 + min.angle,
    hour: restingHour + min.angle / 12,
    flaps,
  }
}
