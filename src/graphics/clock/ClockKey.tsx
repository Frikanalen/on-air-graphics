import { useId } from "react"
/** One monochrome camera/key for the whole stack. Luminance becomes alpha;
 * no per-frame pixel readback. r=128 for both mechanisms. */
export function useClockKey() {
  const id = `clock-key-${useId().replace(/:/g, "")}`
  const lighting =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="352" height="446"><defs><radialGradient id="l" cx="36%" cy="30%" r="75%"><stop stop-color="white"/><stop offset="1" stop-color="#bdbdbd"/></radialGradient></defs><rect width="352" height="316" fill="url(#l)"/><svg y="316" width="352" height="130" viewBox="0 0 352 130"><rect width="352" height="130" fill="url(#l)"/></svg></svg>',
    )
  const filter = (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        <filter
          id={id}
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="soft" />
          <feGaussianBlur in="soft" stdDeviation="4.48" result="bloom" />
          <feComposite
            in="soft"
            in2="bloom"
            operator="arithmetic"
            k2="1"
            k3="0.2"
            result="camera"
          />
          <feImage
            href={lighting}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="lighting"
          />
          {/* Restore opaque black at blur edges before applying lighting.
              Otherwise the blend adds light to partially transparent pixels,
              leaving a rectangular luminance footprint in the key. */}
          <feFlood floodColor="black" result="black" />
          <feComposite
            in="camera"
            in2="black"
            operator="over"
            result="opaqueCamera"
          />
          <feBlend in="opaqueCamera" in2="lighting" mode="multiply" result="lit" />
          <feColorMatrix in="lit" type="luminanceToAlpha" result="key" />
          <feFlood floodColor="#F5EFE4" />
          <feComposite in2="key" operator="in" />
        </filter>
      </defs>
    </svg>
  )
  return { id, filter }
}
