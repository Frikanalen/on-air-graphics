interface Window {
  /** CasparCG start command */
  play: () => void
  /** CasparCG stop command */
  stop: () => void
  /** CasparCG update command */
  update: (data: unknown) => void
  /** CasparCG next command */
  next: () => void
  handleError: typeof console.error
  handleWarning: typeof console.warn
}
