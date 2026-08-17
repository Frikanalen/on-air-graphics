# Changelog

## [1.2.0](https://github.com/Frikanalen/on-air-graphics/compare/v1.1.1...v1.2.0) (2026-08-17)


### Features

* **background:** give the graphics a background of their own ([b148b53](https://github.com/Frikanalen/on-air-graphics/commit/b148b537ed304895044285be141551ac4e8aacd1))
* **dev:** fit the panel to the window and put the controls beside the frame ([df22ed9](https://github.com/Frikanalen/on-air-graphics/commit/df22ed958bc5e53d9b4db435d917e72101dd8296))
* **dev:** show DevPanel in preview when no duration is supplied ([de881ff](https://github.com/Frikanalen/on-air-graphics/commit/de881fff06e83f2a97b566b36bbb8ff23c20a717))
* **dev:** show the plan as a timeline and let it be scrubbed ([5cba4d7](https://github.com/Frikanalen/on-air-graphics/commit/5cba4d7fdf3e2807310b1f6ad3361685ad038ca5))
* **network:** use relative /api URL in kubernetes environs - [#21](https://github.com/Frikanalen/on-air-graphics/issues/21) ([05d0871](https://github.com/Frikanalen/on-air-graphics/commit/05d08719a726f7606d7c62ff727484f148ad5952))
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
