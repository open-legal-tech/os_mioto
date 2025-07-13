import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { adjacencyGraphs, dictionary } from "@zxcvbn-ts/language-common";
import { dictionary as de } from "@zxcvbn-ts/language-de";
import { dictionary as en } from "@zxcvbn-ts/language-en";

export async function isStrongPassword(password: string) {
  const slicedPassword =
    password.length > 50 ? password.substring(0, 50) : password;
  const options = {
    dictionary: {
      ...dictionary,
      ...en,
      ...de,
    },
    graphs: adjacencyGraphs,
  };

  zxcvbnOptions.setOptions(options);
  return zxcvbn(slicedPassword);
}
