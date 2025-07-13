export function createAcronym(name: string) {
  const matches = name.toUpperCase().match(/\b(\w)/g);
  return matches?.join("").slice(0, 2);
}
