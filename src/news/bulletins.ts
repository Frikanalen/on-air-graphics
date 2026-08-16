import { type NewsBulletin } from "./types"

/*
 * PLACEHOLDER COPY -- not for air.
 *
 * Channel news will come from the same backend as the schedule. Until that
 * endpoint exists these three stand in for it, so the planner has something
 * real-shaped to make room for and the views can be tuned against text of a
 * plausible length. Replace the wording before any of this goes out.
 */
export const BULLETINS: NewsBulletin[] = [
  {
    id: "frivillige",
    title: "Vi søker frivillige til sendeteknikk",
    body: "Har du lyst til å lære å kjøre sending? Ingen forkunnskaper er nødvendig.",
  },
  {
    id: "medlemskap",
    title: "Nye medlemsorganisasjoner er velkomne",
    body: "Organisasjoner kan bli medlem og sende sitt eget innhold på Frikanalen.",
  },
  {
    id: "sendetid",
    title: "Meld inn programmene dine i god tid",
    body: "Last opp video og reserver sendetid før tidspunktet du ønsker å sende.",
  },
]
