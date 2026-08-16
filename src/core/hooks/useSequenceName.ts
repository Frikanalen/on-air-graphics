import { SEQUENCE_NAMES } from "../constants"
import { type SequenceName } from "../types"
import { useParams } from "./useParams"

/** Which programme the playout system asked for, ignoring anything unknown. */
export const useSequenceName = (): SequenceName => {
  const { sequence } = useParams({ sequence: "default" })

  return SEQUENCE_NAMES.find((name) => name === sequence) ?? "default"
}
