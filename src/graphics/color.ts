export const clamp = (x: number, lo = 0, hi = 1) =>
  Math.max(lo, Math.min(hi, x))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const linear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
const gamma = (v: number) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
export const hex = (channels: number[]) =>
  "#" +
  channels
    .map((v) =>
      Math.round(clamp(v) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
export function toOKLab(color: string) {
  const [r, g, b] = rgb(color).map(linear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
export function mixColor(a: string, b: string, t: number) {
  if (t <= 0) return a
  if (t >= 1) return b
  const aa = toOKLab(a),
    bb = toOKLab(b)
  const [L, A, B] = aa.map((v, i) => lerp(v, bb[i], t))
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return hex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(gamma),
  )
}
