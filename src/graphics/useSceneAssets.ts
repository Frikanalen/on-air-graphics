import { useEffect, useState } from "react"

export const sceneImages = new Map<string, HTMLImageElement>()

/** A frozen frame must not depend on whether its font/mask has decoded yet.
 * Preload once before mounting the scene, including before an early PLAY cue. */
export function useSceneAssets() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let mounted = true
    const images = [
      "grain.png",
      ...[0, 1, 2].flatMap((i) => [
        `blade-${i}-lit.svg`,
        ...[0, 12, 44, 108].map((sigma) => `blade-${i}-${sigma}.png`),
      ]),
    ].map((name) => {
      const image = new Image()
      sceneImages.set(name, image)
      // CEF's SVG Image.decode() can reject an otherwise loaded, paintable
      // image. The load event works for raster masks and SVG blades alike.
      return new Promise<void>((resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () =>
          reject(new Error(`Unable to load scene asset ${name}`))
        image.src = `${import.meta.env.BASE_URL}scene/${name}`
      })
    })
    Promise.all([
      ...images,
      document.fonts.load("400 26px Inter"),
      document.fonts.load('800 84px "Inter Display"'),
      document.fonts.load('700 81px "Inter Display"'),
    ])
      .then(() => {
        if (mounted) setReady(true)
      })
      .catch((error) => console.error(String(error)))
    return () => {
      mounted = false
    }
  }, [])
  return ready
}
