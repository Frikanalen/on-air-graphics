import { type Plan } from "../sequencing/plan/types"
import { clamp, lerp } from "./color"
import { lightAtTime, mixLight, PAPER, RED, type LightState } from "./sun"

export type Camera = "wide" | "close" | "sheet"
export const cameraFor = (name: string): Camera =>
  name === "intro" || name === "logo"
    ? "wide"
    : name === "slate"
      ? "close"
      : "sheet"
export const lightFor = (name: string, timestamp: number) =>
  cameraFor(name) !== "sheet"
    ? PAPER
    : name === "poster" || name.startsWith("news:")
      ? RED
      : lightAtTime(timestamp)
const poseFor = (camera: Camera, light: LightState): LightState =>
  camera === "wide"
    ? { ...PAPER, tx: 250, ty: 264, scale: 3.25 }
    : camera === "close"
      ? PAPER
      : light
const ease = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2
export function sceneAt(plan: Plan, elapsed: number, timestamp: number) {
  const index = Math.max(
    0,
    plan.segments.findIndex(
      (s, i) =>
        elapsed < s.start + s.duration || i === plan.segments.length - 1,
    ),
  )
  const current = plan.segments[index],
    previous = plan.segments[index - 1]
  const name = current?.spec.name ?? "intro",
    oldName = previous?.spec.name ?? name
  const camera = cameraFor(name),
    oldCamera = cameraFor(oldName)
  const crossCamera = (camera === "sheet") !== (oldCamera === "sheet")
  const local = Math.max(0, elapsed - (current?.start ?? 0))
  const duration = crossCamera || camera !== oldCamera ? 1800 : 800
  const raw = clamp(local / duration),
    p = crossCamera || camera !== oldCamera ? ease(raw) : raw
  const target = lightFor(name, timestamp),
    source = lightFor(oldName, timestamp)
  const a = poseFor(oldCamera, source),
    b = poseFor(camera, target)
  const toSheet = camera === "sheet"
  const sheet = crossCamera ? (toSheet ? p : 1 - p) : toSheet ? 1 : 0
  const wallProgress = clamp(sheet / 0.8)
  let light = mixLight(source, target, p)
  if (crossCamera)
    light = mixLight(PAPER, toSheet ? target : source, wallProgress)
  return {
    name,
    oldName,
    camera,
    index,
    local,
    crossCamera,
    p,
    sheet,
    light,
    bladeLight: crossCamera ? (toSheet ? target : source) : light,
    tx: lerp(a.tx, b.tx, p),
    ty: lerp(a.ty, b.ty, p),
    scale: lerp(a.scale, b.scale, p),
    skew: lerp(a.skew, b.skew, p),
    fill: clamp((sheet - 0.3) / 0.4),
    blur:
      clamp((sheet - 0.2) / 0.8) *
      (crossCamera ? (toSheet ? target : source).tight : light.tight),
    wide: clamp((sheet - 0.5) / 0.5),
    grain: clamp((sheet - 0.5) / 0.5) * 0.07,
    softShadow: 0.11 * (1 - clamp(sheet / 0.3)),
    incoming:
      name === "slate" && camera !== oldCamera
        ? clamp((local - duration) / 500)
        : crossCamera
          ? clamp((local - 1300) / 500)
          : clamp(local / 500),
    outgoing: 1 - clamp(local / 300),
    clock: crossCamera
      ? toSheet
        ? clamp((local - 1300) / 500)
        : 1 - clamp(local / 300)
      : toSheet
        ? 1
        : 0,
  }
}
