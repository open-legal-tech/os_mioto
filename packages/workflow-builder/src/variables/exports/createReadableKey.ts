const charMap = {
  0: "a",
  1: "b",
  2: "c",
  3: "d",
  4: "e",
  5: "f",
  6: "g",
  7: "h",
  8: "i",
  9: "j",
} as any;

export const createReadableKey = (key: string[]) => {
  return key
    .map((key) => {
      return key
        .split(" ")
        .join("_")
        .replace(/\./g, "_")
        .replace(/\u00df/g, "ss")
        .replace(/\u00e4/g, "ae")
        .replace(/\u00f6/g, "oe")
        .replace(/\u00fc/g, "ue")
        .replace(/\u00c4/g, "Ae")
        .replace(/\u00d6/g, "Oe")
        .replace(/\u00dc/g, "Ue")
        .replace(/[^a-zA-Z0-9._]/g, "")
        .replace(/_+/, "_")
        .replace(/\d/g, (match) => charMap[match]);
    })
    .join(".");
};
