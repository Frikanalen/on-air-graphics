const parse = <T>(defaultValue: T, value: string | null): any => {
  if (value === null) return defaultValue

  if (typeof defaultValue === "string") {
    return value
  }

  if (typeof defaultValue === "number") {
    const parsed = Number(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  if (typeof defaultValue === "boolean") {
    return value !== null
  }
}

export const useParams = <O extends object>(defaultValues: O): O => {
  const params = new URLSearchParams(window.location.search)
  const object = {} as O

  for (const [key, defaultValue] of Object.entries(defaultValues)) {
    object[key as keyof O] = parse(defaultValue, params.get(key))
  }

  return object
}
