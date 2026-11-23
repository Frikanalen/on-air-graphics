# Changelog

## [1.8.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.7.0...v1.8.0) (2026-11-20)


### Features

* **schedule:** a gap before another holder's airtime ends on a handover page ([#48](https://github.com/Frikanalen/on-air-graphics/issues/48)) ([2124b73](https://github.com/Frikanalen/on-air-graphics/commit/2124b736e89328a10dc75fe1c2bd8c2c037da590))


### Bug Fixes

* **schedule:** no handover or holder line for the station's own airtime ([#50](https://github.com/Frikanalen/on-air-graphics/issues/50)) ([fe4b705](https://github.com/Frikanalen/on-air-graphics/commit/fe4b705c803e7dd1f01d338e646146653808b27a))

## [1.7.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.6.0...v1.7.0) (2026-11-19)


### Features

* **schedule:** say whose airtime it is, and list airtime without programmes ([#45](https://github.com/Frikanalen/on-air-graphics/issues/45)) ([f9ea28f](https://github.com/Frikanalen/on-air-graphics/commit/f9ea28fcc2b734671f2c05c55bfdf7e62903f2a3))


### Bug Fixes

* update nginx to 1.30.7 (nginx2root CVEs) ([#47](https://github.com/Frikanalen/on-air-graphics/issues/47)) ([bf00254](https://github.com/Frikanalen/on-air-graphics/commit/bf00254845c6d609a0a37482ec1cbf9317af730e))

## [1.6.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.5.0...v1.6.0) (2026-11-15)


### Features

* an editor's preview frame follows the text as it is typed ([57d6082](https://github.com/Frikanalen/on-air-graphics/commit/57d6082271249c36ebdbd61ff236d0074dd79a61))
* members' text posters in three looks ([9a1021c](https://github.com/Frikanalen/on-air-graphics/commit/9a1021ca0ba4aba7cfe424f77a3392175578e7ff))
* neutral member posters and a moving light on every held screen ([b7b49ac](https://github.com/Frikanalen/on-air-graphics/commit/b7b49ac5cfa6c762fe5f009604988210476cd523))
* **poster:** light by day, dark by night; slides split at blank lines ([9d5671d](https://github.com/Frikanalen/on-air-graphics/commit/9d5671d2a6b5c58a830b70df3f8ac99c133c644f))
* schedule page on one grid, turning pages when it has the time ([#42](https://github.com/Frikanalen/on-air-graphics/issues/42)) ([c0404eb](https://github.com/Frikanalen/on-air-graphics/commit/c0404eba238f33a769b6443a522b5425b0010a9d))
* Schibsted Grotesk, readable footer, one notice logo, a standby card ([d4219ac](https://github.com/Frikanalen/on-air-graphics/commit/d4219aca64dfc37e4bf42f2adb776e53b11b8498))
* the channel's bulletins on the slate, paged ([099b578](https://github.com/Frikanalen/on-air-graphics/commit/099b578c78ab742343445ed7b4eba91a94599d3a))
* the channel's bulletins on the slate, paged, and the design review changes ([bd28344](https://github.com/Frikanalen/on-air-graphics/commit/bd2834440836c6de59f03230118feb9e664acf7c))


### Bug Fixes

* **poster:** readable label by day, shorter lines, slides fade in ([914b3b5](https://github.com/Frikanalen/on-air-graphics/commit/914b3b597bf84d124e3b6c8b7cc668cbcc0643f1))
* **poster:** sum reading time in tenths; accept CRLF ([99625e1](https://github.com/Frikanalen/on-air-graphics/commit/99625e1caf04097aa68632b4c1d753b8ca69f8af))

## [1.5.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.4.0...v1.5.0) (2026-11-11)


### Features

* credit the filler music under the graphics ([#39](https://github.com/Frikanalen/on-air-graphics/issues/39)) ([e586ac0](https://github.com/Frikanalen/on-air-graphics/commit/e586ac0125ec3055179724211ac34263120cedb1))

## [1.4.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.3.1...v1.4.0) (2026-11-11)


### Features

* air the member message with reserved reading time ([#36](https://github.com/Frikanalen/on-air-graphics/issues/36)) ([f3e7189](https://github.com/Frikanalen/on-air-graphics/commit/f3e7189aa9001bee9ed203c1cbad134b287d73c5))
* **chart:** run two replicas spread across nodes, behind a PDB ([#31](https://github.com/Frikanalen/on-air-graphics/issues/31)) ([11fc806](https://github.com/Frikanalen/on-air-graphics/commit/11fc8065ae2a099a4bf78e575fad7f305731b0b4))
* show a "programme not available" notice when playout asks for it ([#33](https://github.com/Frikanalen/on-air-graphics/issues/33)) ([41f7276](https://github.com/Frikanalen/on-air-graphics/commit/41f7276f9f5d458ac4bb946f08d29c351da61cb4))


### Bug Fixes

* transition directly from logo to schedule in short gaps ([#38](https://github.com/Frikanalen/on-air-graphics/issues/38)) ([f0527db](https://github.com/Frikanalen/on-air-graphics/commit/f0527db8bc20ed3026f52552e5a9f3c2c4e316a7))

## [1.3.1](https://github.com/Frikanalen/on-air-graphics/compare/v1.3.0...v1.3.1) (2026-11-08)


### Bug Fixes

* **docker:** ship public/ in the image, so /graphics/protest/ is served ([#29](https://github.com/Frikanalen/on-air-graphics/issues/29)) ([499384a](https://github.com/Frikanalen/on-air-graphics/commit/499384ac1c03c10949b34757d59325b4c77c9937))
* ship public/ in the image so /graphics/protest/ is served ([#28](https://github.com/Frikanalen/on-air-graphics/issues/28)) ([88f659e](https://github.com/Frikanalen/on-air-graphics/commit/88f659ee257b08173763048811f8b209e8cf2e2f))

## [1.3.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.2.0...v1.3.0) (2026-11-08)


### Features

* move from frikanalen.no to frikanalen.tv ([#27](https://github.com/Frikanalen/on-air-graphics/issues/27)) ([3a2ab07](https://github.com/Frikanalen/on-air-graphics/commit/3a2ab07fd65741ac52389af1d10beaeabe66cdf0))
* **protest:** full-screen statement page for CasparCG ([#24](https://github.com/Frikanalen/on-air-graphics/issues/24)) ([c88dbdf](https://github.com/Frikanalen/on-air-graphics/commit/c88dbdfa7ef20ffab1eb1535e1dae25155e6e6ab))

## [1.2.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.1.1...v1.2.0) (2026-10-29)


### Features

* **background:** give the graphics a background of their own ([b148b53](https://github.com/Frikanalen/on-air-graphics/commit/b148b537ed304895044285be141551ac4e8aacd1))
* **dev:** fit the panel to the window and put the controls beside the frame ([df22ed9](https://github.com/Frikanalen/on-air-graphics/commit/df22ed958bc5e53d9b4db435d917e72101dd8296))
* **dev:** show DevPanel in preview when no duration is supplied ([de881ff](https://github.com/Frikanalen/on-air-graphics/commit/de881fff06e83f2a97b566b36bbb8ff23c20a717))
* **dev:** show the plan as a timeline and let it be scrubbed ([5cba4d7](https://github.com/Frikanalen/on-air-graphics/commit/5cba4d7fdf3e2807310b1f6ad3361685ad038ca5))
* **network:** use relative /api URL in kubernetes environs - [#21](https://github.com/Frikanalen/on-air-graphics/issues/21) ([05d0871](https://github.com/Frikanalen/on-air-graphics/commit/05d08719a726f7606d7c62ff727484f148ad5952))
* **schedule:** refetch the schedule when Django says it changed ([#22](https://github.com/Frikanalen/on-air-graphics/issues/22)) ([d89acdc](https://github.com/Frikanalen/on-air-graphics/commit/d89acdc6edcf9790f171b92c35be9afb0670f337))
* **sequencing:** drive the views from a playhead instead of timer chains ([ab85f08](https://github.com/Frikanalen/on-air-graphics/commit/ab85f081f68bbf3961a435549f64cb730cb342d4))
* **sequencing:** fill the slot with content that suits its length ([a641dd6](https://github.com/Frikanalen/on-air-graphics/commit/a641dd617a729a5fea5fce10ee813317bb5a5a30))
* **sequencing:** hold the sting, the news and the slate back from air ([9f5fdb1](https://github.com/Frikanalen/on-air-graphics/commit/9f5fdb1998f2ea3b962ae90672a97846608ad8bc))
* **sequencing:** keep the mark and the clock across the whole intermission ([6e3998a](https://github.com/Frikanalen/on-air-graphics/commit/6e3998a599581f9f6d7c16e195b83c00f4689353))
* **sequencing:** plan a timeline from the budget the playout gives us ([cb13170](https://github.com/Frikanalen/on-air-graphics/commit/cb131700e965fa03578e89e4f4bd5346e86aab61))


### Bug Fixes

* auto-play preview when no duration is supplied ([0093117](https://github.com/Frikanalen/on-air-graphics/commit/0093117347a956b911a781061ef15ed8f7ca8fa3))
* **deps:** catch up build toolchain to what staging proved out (Vite 4-&gt;7, StyleX 0.5-&gt;0.17, Tailwind 3-&gt;4) ([382142f](https://github.com/Frikanalen/on-air-graphics/commit/382142f97259805f68d0ec9e586aded8a415c6b0))
* **deps:** React 18 -&gt; 19, with the nodeRef compatibility fix in the same commit ([0185b30](https://github.com/Frikanalen/on-air-graphics/commit/0185b30b7a0f81efa1efcd77b69bcbaf3e48ad30))
* **params:** coerce booleans instead of returning the raw query value ([933ff2a](https://github.com/Frikanalen/on-air-graphics/commit/933ff2a1b5a777f106e3cbb89d7099bc030a136c))
* **poster:** stop keyed output drawing the card panel over video ([6f6416c](https://github.com/Frikanalen/on-air-graphics/commit/6f6416cddc0499279ae2879c010c3f929a939ea3))
* repair yarn lint under flat ESLint config ([1784327](https://github.com/Frikanalen/on-air-graphics/commit/17843273c42ba0a8918fb43e50ccad2bfe977a68))
* **schedule:** ask for the whole day so the schedule stops emptying out ([fe3c006](https://github.com/Frikanalen/on-air-graphics/commit/fe3c0060e808056611ddf955666b74c12fe7e0a7))
* **schedule:** ask the server, not the browser cache, for the schedule ([#23](https://github.com/Frikanalen/on-air-graphics/issues/23)) ([0c6dfbd](https://github.com/Frikanalen/on-air-graphics/commit/0c6dfbd87ef432ecf607690ff2ed0e1e07793be1))
* **schedule:** read the schedule from context instead of fetching it twice ([2d83edd](https://github.com/Frikanalen/on-air-graphics/commit/2d83edd1db04562aceb147de9f90321599d8d523))
* **sequencing:** attach the Transition nodeRef so view timings are honoured ([b0803a0](https://github.com/Frikanalen/on-air-graphics/commit/b0803a0a4a4f9a03942aa316ded4ee817123a204))
* **sequencing:** cancel the pending view handover instead of orphaning it ([207f558](https://github.com/Frikanalen/on-air-graphics/commit/207f5584db8bbf7d2b0b9f2997d9f63b57f03ebd))
* **sequencing:** keep the frame loop running when a subscriber rejoins ([e7c2b4c](https://github.com/Frikanalen/on-air-graphics/commit/e7c2b4c5217c39c8e78598788448ce73b3a96850))
* **styling:** hold the first keyframe through the schedule's animation delays ([3be9d09](https://github.com/Frikanalen/on-air-graphics/commit/3be9d09342472e207ba3fe6afad15f80522ea25c))
* **styling:** stop fading a backdrop root over the frosted cards ([292ded0](https://github.com/Frikanalen/on-air-graphics/commit/292ded09cfa68db050b42d5fc4b6b2d36d90dc3e))

## [1.1.1](https://github.com/Frikanalen/on-air-graphics/compare/v1.1.0...v1.1.1) (2026-08-15)


### Bug Fixes

* **ci:** let release-please read its config so the chart version tracks releases ([31db689](https://github.com/Frikanalen/on-air-graphics/commit/31db689c945d006601aff5feada6dea963790974))

## [1.1.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.0.0...v1.1.0) (2026-08-15)


### Features

* add helm chart for kubernetes deployment ([#2](https://github.com/Frikanalen/on-air-graphics/issues/2)) ([6cf7828](https://github.com/Frikanalen/on-air-graphics/commit/6cf7828588a8d70c7624c44d4c5d8173ba85a351))

## 1.0.0 (2025-12-18)


### Bug Fixes

* remove video copy from package.json build ([5d53a78](https://github.com/Frikanalen/on-air-graphics/commit/5d53a7826b70b6298b52852471f3863a73534113))
