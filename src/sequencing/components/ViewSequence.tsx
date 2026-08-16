import {
  createRef,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
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
  const app = useContext(AppContext)
  const { sequence } = props

  const [index, setIndex] = useState(0)
  const [showView, setShowView] = useState(true)

  /*
   * <Transition> resolves its timeout against nodeRef.current and silently
   * finishes on the next tick when that is null, so the ref has to reach the
   * element it names. Each keyed child needs its own: during a handover the
   * outgoing and incoming views are mounted at the same time.
   */
  const nodeRefs = useRef(new Map<string, RefObject<HTMLDivElement | null>>())
  const nodeRefFor = (name: string) => {
    const existing = nodeRefs.current.get(name)
    if (existing) return existing

    const created = createRef<HTMLDivElement>()
    nodeRefs.current.set(name, created)

    return created
  }

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

    const nodeRef = nodeRefFor(entry.name)

    return (
      <Transition nodeRef={nodeRef} key={entry.name} timeout={2000}>
        {(status) => (
          <div ref={nodeRef} className="absolute top-0 left-0 h-full w-full">
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
        "before:transition-opacity before:duration-(--fk-fade-transition) before:ease-[ease]",
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
