import { createContext } from "react"
import { type Bulletin } from "./types"

export const BulletinContext = createContext<Bulletin[]>([])
