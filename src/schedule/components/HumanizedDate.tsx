import { useEffect, useState } from "react"
import { humanizeDate } from "../helpers/humanizeDate"

export interface HumanizedDateProps {
  date: Date
}

export function HumanizedDate(props: HumanizedDateProps) {
  const { date } = props
  const [humanized, setHumanized] = useState(humanizeDate(date))

  useEffect(() => {
    const interval = setInterval(() => {
      setHumanized(humanizeDate(date))
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [date])

  return <>{humanized}</>
}
