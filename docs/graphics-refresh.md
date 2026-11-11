# Graphics refresh

All output is opaque, progressive 16:9 at **50 fps**. The 1280×720 stage is
scaled by viewport width / 1280, including DOM typography. 1920×1080 uses the
same composition and 1080p blade masks. The editorial tier ladder, budget
allocation, schedule fetching and live schedule-change subscription are retained.
The cream organisation slate precedes the schedule in gaps of at least 21.7 seconds.
Shorter gaps retain intro → schedule; news and the other optional compositions remain parked.
A 60-second gap allocates 3.2 s to the intro, 6 s to the slate, 50.3 s to the schedule
and reserves 0.5 s for the external exit fade.
The slate text stays hidden during the 1.8 s blade movement, then fades in over
0.5 s once the blades have settled.
The next-programme start time uses 40 px type; the title has a wider column and
can wrap to three lines at 28 px before truncating.
Upcoming programme titles wrap to two lines at 21 px, with 80 px rows keeping
all four entries above the footer.

## Build and deploy

The branch workflow publishes `ghcr.io/frikanalen/graphics:codex-on-air-graphics-refresh`
and an immutable `sha-<7-character-commit>` tag. Set the existing Helm chart's
`image.tag` to the desired SHA tag to deploy that exact build. The container serves
HTTP on port 80 under `/graphics/`; keep `/api` routed to Django on the same origin.

Build locally with `docker build -t frikanalen-graphics:refresh .`.
The builder uses the lockfile and runs unit tests, lint and the production build.
The Nginx stage includes the self-hosted fonts, scene textures and public pages;
build assertions catch missing fonts/textures. `.dockerignore` excludes generated
output and old video loops while retaining these required public assets.

To check the actual container's output, run it with `docker run --rm -p 4180:80
frikanalen-graphics:refresh`, then run `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4180
yarn test:visual`. This uses the full visual suite against Nginx with mocked API
responses, without starting Vite.

## Review

Run `yarn install --frozen-lockfile`, `yarn dev`, then open `/graphics/`.
Production remains controlled by CasparCG PLAY/STOP with the existing `duration`,
`sequence`, `message` and `type` parameters. `dev=true` explicitly opens the
existing scenario/scrubbing panel; `dev=false` gives full-frame output locally.
Without `duration` the dev menu opens automatically, including in the Docker image.
It provides scenario buttons, a budget input in seconds, playback controls and timeline
scrubbing. The URL parameter uses milliseconds: `duration=60000` requests 60 seconds.
Loading assets does not consume the opening scene’s allotted time.
Use `dev=false` to explicitly request a full-frame automatic preview without a duration.

`t=2026-11-10T19:07:00.212` freezes the shared clock. An ISO value without an
offset means Europe/Oslo, irrespective of the browser/machine timezone; explicit
`Z` or `+01:00` also work (URL-encode the plus sign). Invalid dates and spring DST
gaps are rejected; the autumn fold chooses the first occurrence.

`view=intro|logo|slate|next|schedule|news|poster` selects a stable review frame,
independent of the planner. For example:

- `/graphics/?view=slate&t=2026-11-10T19:06:50`
- `/graphics/?view=schedule&t=2026-11-10T12:10:50`
- `/graphics/?view=schedule&t=2026-11-10T15:20:50`
- `/graphics/?view=schedule&t=2026-11-10T16:25:50`
- `/graphics/?view=schedule&t=2026-11-10T20:59:50`
- `/graphics/?view=news&t=2026-11-10T19:06:50`
- `/graphics/?view=schedule&t=2026-11-10T19:07:00.212`

The existing development playhead scrubs the camera and text choreography as well
as the planner. A frozen wall clock still allows manual playhead seeks. The clock
hands, flaps, drift, solar elevation, and layout filtering all read that same input.

## Renderer

The scene selects one WebGL canvas when the renderer identifies hardware
acceleration. Known software implementations (llvmpipe/SwiftShader) and unavailable
WebGL use DOM layers. Both consume the same pure scene model and pre-rasterised
blade masks; there is no live blade/backdrop blur. `renderer=dom|webgl` is an
explicit review override. Context loss immediately redraws the DOM fallback,
even with a frozen clock, and restoration rebuilds the GPU resources. The WebGL
buffer is preserved for CEF’s offscreen capture of frozen frames.

The DOM fallback repaints the paper/sheet radial gradient when its interpolated
colour changes; blade poses and blur interpolation use transforms and opacity.
Colour interpolation uses OKLab. The only live blur is the small clock capture's
camera softness/bloom and hand shadows. Its single SVG luminance key covers both
mechanisms and avoids CPU pixel readback. Split-flap numerals are cached and
perspective projected. Fonts and scene assets load before the scene mounts.

`public/scene` is committed and builds offline. Regenerate with `yarn assets:scene`
(ImageMagick 7 and Playwright Chromium required). The first three paths are extracted unchanged from Logo.
Masks use sigma 0, 12, 44 at the largest sheet scale; an extra 108 mask allows the
close camera's 50-du soft shadow without runtime filtering.
`public/fonts/InterVariable.woff2` is the official Inter variable font; body uses
optical size 14 and display text 32. Its OFL license is shipped alongside it.

Solar position follows NOAA's Julian-century formulas, geometric elevation:
https://gml.noaa.gov/grad/solcalc/main.js . No weather or solar network request is
made in the application.

## Verification and remaining acceptance

`yarn test`, `yarn lint`, `yarn build` check pure behaviour and production output.
`yarn test:visual` uses Playwright (`yarn playwright install chromium` first), mocks
schedule/network data, captures all specified fixed-time candidates plus intro,
next/poster and 1080p, checks assets and layout, and verifies repeated frozen-frame
captures are identical. Candidates are in `test-results/`; the design stills were
not supplied with the spec, so no pixel baseline is claimed or approved. Review
against those stills before committing image baselines.

`/graphics/probe/index.html` is a standalone 60-second full-frame blur probe. It reports CEF
user agent, WebGL renderer/acceleration, average and worst RAF intervals, and JS
work. At 50 fps an ideal **frame interval is 20 ms**; this is distinct from the
**10 ms render-work budget**. RAF and JS timings cannot measure total compositor
work or CasparCG dropped frames. Use CEF tracing/Caspar diagnostics for that.
The probe exposes `window.probeResult` and logs `FK_RENDERER_PROBE` for capture.
It has no schedule dependency and supports `?seconds=...` for a smoke test.

Run the probe and each view for ten minutes on an isolated local/staging CasparCG
channel, record Caspar diagnostics, and require zero dropped frames at 720p and
1080p. Live box performance and the ten-minute acceptance runs remain to be
measured; the implementation must not be treated as meeting that budget based
on a headless browser check alone.

## Capture the actual producer output

Use `python3 scripts/capture-caspar.py --url http://HOST:4175/graphics/?dev=false
--seconds 10 --file refresh-dolly.mkv` on a development channel. The script adds
a lossless FFmpeg FILE consumer, records at the channel’s 50 fps and removes the
consumer in `finally` so Matroska is finalized. The file is in the **server’s**
media directory. Use `ffmpeg -sseof -0.05 -i refresh-dolly.mkv -frames:v 1 still.png`
to extract the final still. Supply `--seconds 600` for each soak test.

## Local verification evidence

- `yarn test`: 93 passing tests across 11 files; `yarn lint` and `yarn build` pass.
- `yarn test:visual`: 22 passing checks, including fixed inputs, both renderers,
  1080p scaling and context loss/restoration while time is frozen. Pixel checks
  ensure black/empty clock captures key out completely at both resolutions.
- CasparCG 2.5.1 / CEF 142, ANGLE / NVIDIA GeForce RTX 5080, OpenGL 4.5:
  all seven views captured via the actual FFmpeg consumer at 1280×720p50;
  schedule also captured at 1920×1080p50. The live dolly recording contains
  455 video frames at 50/1 fps over 9.1 seconds.
  A black clock-key fixture also captures as a uniform background with no edge
  pixels; the analog and digital clock details remain visible beside it.
- The accelerated 60-second full-frame blur probe recorded 3,002 RAF callbacks,
  interval average **20.040 ms**, worst **121.5 ms**, two intervals above 22 ms.
  JS work averaged 0.039 ms, worst 0.8 ms. These measurements include startup
  and concurrent browser checks and are not compositor timing measurements.
  **The 10 ms render budget and ten-minute zero-drop acceptance are unverified.**

The initial development container had Docker's default 64 MiB `/dev/shm` (97%
full). CEF crashed with `TransferBuffer::Initialize() failed`, causing loading
stalls and context loss. An isolated copy with `--shm-size=1g` completed the view
captures without those errors. Shared memory was about 85 MiB at 720p, so use at
least 1 GiB for Docker-based checks; this is separate from GPU VRAM. Mask textures
use alpha-only GPU storage. The original dev container and its GPU configuration
are retained. The temporary CEF debugger setting was restored before the user's
GPU changes; subsequent verification uses an AMCP-added consumer with no debugger.

The refreshed frame retains main’s `unavailable` query option: a named or generic
programme-unavailable notice replaces the sequence, scales with the broadcast
frame, and follows the playout play/stop fade without showing a station clock.

Loading and uncued output are transparent. The scene becomes visible only after
its first configured draw, and new view layers default to zero opacity until
the frame callback applies their transition state before paint. This avoids
showing unpositioned grain/blades or premature slate text during startup.
The startup change is verified by 24 browser checks, including alpha-transparent
preload comparisons for both renderers and an insertion-time slate visibility check.
