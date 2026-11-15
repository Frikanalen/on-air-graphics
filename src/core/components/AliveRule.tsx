import classNames from "classnames"

/**
 * A short rule with a light that keeps travelling along it. Every screen
 * that otherwise holds still has one, so a running picture can be told from
 * a frozen one at a glance. `brand` draws it in the logo's three colours,
 * for the channel's own screens; without it the rule takes the text colour.
 */
export function AliveRule(props: { className?: string; brand?: boolean }) {
  return (
    <div
      className={classNames("alive-rule", props.className, {
        "alive-rule-brand": props.brand,
      })}
      aria-hidden
    >
      <i />
    </div>
  )
}
