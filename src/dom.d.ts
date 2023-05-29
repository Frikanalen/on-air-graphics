interface Window {
  /** CasparCG start command */
  play: () => void
  /** CasparCG stop command */
  stop: () => void
  /** CasparCG update command */
  update: (data: any) => void
  /** CasparCG next command */
  next: () => void
  handleError: (e: any) => void
  handleWarning: (e: any) => void
}
