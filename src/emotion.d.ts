import "@emotion/react"

declare module "@emotion/react" {
  export interface Theme {
    color: {
      card: string
      cardFallback: string
      accent: string
    }
    fontColor: {
      overlay: string
      normal: string
      muted: string
    }
    gradient: {
      overlay: string
    }
    stateColor: {
      warning: string
    }
    shadow: {
      card: string
    }
  }
}
