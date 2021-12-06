export const getRandomItem = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)]
