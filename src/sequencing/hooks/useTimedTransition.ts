import { useEffect, useState } from "react"
import { delay } from "../../core/helpers/delay"

export type TransitionState = "start" | "appear" | "disappear"

export type UseTimedTransitionOptions = {
  appear: number
  duration: number
  disappear: number
  onFinished: () => void
}

export const useTimedTransition = (options: UseTimedTransitionOptions) => {
  const { duration, disappear, appear, onFinished } = options
  const [state, setState] = useState<TransitionState>("start")

  useEffect(() => {
    const run = async () => {
      await delay(1)
      setState("appear")

      await delay(duration - (disappear + appear))
      setState("disappear")

      await delay(disappear)
      onFinished()
    }

    run()
  }, [])

  return state
}
