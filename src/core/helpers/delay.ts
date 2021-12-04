export const delay = (ms: number) => {
  return new Promise((resolve) => {
    const now = Date.now()

    const check = () => {
      const difference = Date.now() - now

      if (difference >= ms) {
        return resolve(undefined)
      }

      setTimeout(check, 1)
    }

    check()
  })
}
