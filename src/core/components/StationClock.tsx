import { Clock } from "./Clock"
import { Logo } from "./Logo"
export function StationClock() {
  return (
    <div className="station-clock">
      <Logo className="station-logo" />
      <Clock />
    </div>
  )
}
