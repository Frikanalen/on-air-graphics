/**
 * Spellings that read as "off" in a query string. Anything else present is
 * taken as "on", so a bare `?flag` enables a boolean.
 */
const FALSE_VALUES = ["false", "0", "no", "off"]

const parse = <T>(
  defaultValue: T,
  value: string | null,
): number | boolean | string | T => {
  if (value === null) return defaultValue

  if (typeof defaultValue === "string") return value

  if (typeof defaultValue === "number")
    return isNaN(Number(value)) ? defaultValue : Number(value)

  if (typeof defaultValue === "boolean")
    return !FALSE_VALUES.includes(value.trim().toLowerCase())

  return defaultValue
}

export const useParams = <O extends object>(defaultValues: O): O => {
  const params = new URLSearchParams(window.location.search)
  const object = {} as O

  for (const [key, defaultValue] of Object.entries(defaultValues)) {
    object[key as keyof O] = parse(defaultValue, params.get(key))
  }

  return object
}
