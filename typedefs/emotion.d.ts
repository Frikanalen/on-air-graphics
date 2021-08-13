import "@emotion/react"

declare module "@emotion/react" {
  export interface Theme {
    color: {
      card: string
      accent: string
    }
    fontColor: {
      normal: string
      muted: string
    }
    gradient: {
      overlay: string
    }
  }
}
