import { ReactNode, useContext, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import {
  Transition,
  TransitionGroup,
  type TransitionStatus,
} from "react-transition-group"
import { delay } from "../../core/helpers/delay"
import { AppContext } from "../../core/components/AppContext.tsx"

const DELAY = 200

export interface SequenceEntry {
  name: string
  duration: number
  render: (status: TransitionStatus) => ReactNode
  overlay?: boolean
}

export interface ViewSequenceProps {
  sequence: SequenceEntry[]
}

export function ViewSequence(props: ViewSequenceProps) {
  const nodeRef = useRef(null)
  const app = useContext(AppContext)
  const { sequence } = props

  const [index, setIndex] = useState(0)
  const [showView, setShowView] = useState(true)

  useEffect(() => {
    const entry = sequence[index]

    const advance = async () => {
      if (!Number.isFinite(entry.duration)) return

      await delay(entry.duration - DELAY)
      setShowView(false)
      await delay(DELAY)

      setShowView(true)
      setIndex(index + 1)
    }

    if (entry && app.state === "active") {
      advance()
    }
  }, [app, index])

  const renderView = () => {
    const entry = sequence[index]

    if (!showView || !entry || app.state !== "active") return null

    return (
      <Transition nodeRef={nodeRef} key={entry.name} timeout={2000}>
        {(status) => (
          <div className="absolute top-0 left-0 h-full w-full">
            {entry.render(status)}
          </div>
        )}
      </Transition>
    )
  }

  const entry = sequence[index]
  const overlay = entry?.overlay !== false && app.state === "active"

  return (
    <div
      className={classNames(
        "before:absolute before:inset-0 before:content-['']",
        "before:[transition:opacity_500ms_ease]",
        app.keyed
          ? "before:bg-transparent"
          : "before:bg-[image:var(--fk-gradient-overlay)]",
        overlay ? "before:opacity-100" : "before:opacity-0",
      )}
    >
      <TransitionGroup>{renderView()}</TransitionGroup>
    </div>
  )
}
