export const MEMBER_HEADING = "Til Frikanalens medlemmer"
export const MEMBER_PARAGRAPHS = [
  "Frikanalens ordinære sendinger har nå vært stanset i åtte dager. Vi beklager ulempene dette har ført til for medlemmer, seere og andre som bruker kanalen.",
  "Beslutningen om å stanse sendingene var ikke lett, men den var nødvendig av hensyn til Frikanalens fremtid. En gruppe medlemmer har tatt kontroll over kanalen gjennom en udemokratisk prosess, der organisasjonens vedtekter og det ordinære årsmøtets beslutninger er satt til side. Vi kan ikke tillate at en kanal som skal være en åpen plattform for sivilsamfunnet, overtas på denne måten.",
  "Å stanse sendingene er et langt mer inngripende tiltak enn det som normalt bør brukes i en organisasjonskonflikt. Når gruppen som har tatt kontroll over kanalen har satt spillereglene til side, har vi vært nødt til å bruke drastiske virkemidler for å gjøre alvoret tydelig og verne om kanalens fremtid.",
  "Vi vil gjenoppta sendingene, men med unntak av innhold fra dem som har bidratt til overtakelsen. Målet er at Frikanalen igjen skal være en åpen og demokratisk styrt kanal for sivilsamfunnet.",
]

// Include the heading on every page, at 180 words/minute, rounded to 50 fps.
// Reading starts only after the 1.8s blade movement and 0.5s entrance fade.
export const MEMBER_ENTRANCE_MS = 2300
export const MEMBER_PAGES = MEMBER_PARAGRAPHS.map((text) => ({
  text,
  duration: Math.max(
    12000,
    Math.ceil(
      (((text + " " + MEMBER_HEADING).split(/\s+/).length * 60000) / 180 +
        500) /
        20,
    ) * 20,
  ),
}))
export const MEMBER_MESSAGE_MS =
  MEMBER_ENTRANCE_MS +
  MEMBER_PAGES.reduce((sum, page) => sum + page.duration, 0)
export function memberPageAt(elapsed: number) {
  let end = MEMBER_ENTRANCE_MS
  return MEMBER_PAGES.findIndex((page, i) => {
    end += page.duration
    return elapsed < end || i === MEMBER_PAGES.length - 1
  })
}
