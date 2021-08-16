import { useEffect, useState } from "react"
import { wait } from "../../core/helpers/wait"

export type TransitionState = "start" | "appear" | "disappear"

export type UseTimedTransitionOptions = {
  appear: number
  duration: number
  disappear: number
  onFinished: () => void
}

export const useTimedTransition = (options: UseTimedTransitionOptions) => {
  const { duration, disappear, onFinished } = options
  const [state, setState] = useState<TransitionState>("start")

  useEffect(() => {
    const run = async () => {
      await wait(1)
      setState("appear")

      await wait(duration - disappear)
      setState("disappear")

      await wait(disappear)
      onFinished()
    }

    run()
  }, [])

  return state
}
