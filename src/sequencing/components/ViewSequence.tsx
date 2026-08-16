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

  const entry = sequence[index]

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

  /*
   * Hold the current view, then hand over to the next one after a brief gap.
   * The caller rebuilds the sequence array on every render, so this depends on
   * the entry's duration rather than the entry itself -- an unrelated re-render
   * must not restart the hold. Cancelling on cleanup keeps a state change
   * mid-hold from leaving an orphaned handover running against a stale index.
   */
  const duration = entry?.duration

  useEffect(() => {
    if (app.state !== "active" || duration === undefined) return
    if (!Number.isFinite(duration)) return

    let handover: ReturnType<typeof setTimeout> | undefined

    const hold = setTimeout(() => {
      setShowView(false)

      handover = setTimeout(() => {
        setShowView(true)
        setIndex((current) => current + 1)
      }, DELAY)
    }, duration - DELAY)

    return () => {
      clearTimeout(hold)
      clearTimeout(handover)
    }
  }, [app.state, duration, index])

  const renderView = () => {
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
