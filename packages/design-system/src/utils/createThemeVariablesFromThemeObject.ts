export const createThemeVariablesFromThemeObject = (tokensMap: any) => {
  const tokenVariables = {} as Record<string, string>;

  for (const key in tokensMap?.space) {
    const value = tokensMap?.space[key];
    tokenVariables[`--space${key}`] = value;
  }

  tokenVariables[`--fontFamily-heading`] =
    `var(--fontFamily-${tokensMap?.fontFamily.heading})`;

  tokenVariables[`--fontFamily-text`] =
    `var(--fontFamily-${tokensMap?.fontFamily.text})`;

  for (const key in tokensMap?.fontSize) {
    const value = tokensMap?.fontSize[key];
    tokenVariables[`--fontSize-${key}`] = value;
  }

  for (const key in tokensMap?.fontWeight) {
    const value = tokensMap.fontWeight[key];
    tokenVariables[`--fontWeight-${key}`] = value;
  }

  for (const key in tokensMap?.lineHeight) {
    const value = tokensMap?.lineHeight[key];
    tokenVariables[`--lineHeight-${key}`] = value;
  }

  for (const key in tokensMap?.letterSpacing) {
    const value = tokensMap?.letterSpacing[key];
    tokenVariables[`--letterSpacing-${key}`] = value;
  }

  for (const key in tokensMap?.shadow) {
    const value = tokensMap?.shadow[key];
    tokenVariables[`--shadow${key}`] = value;
  }

  for (const key in tokensMap?.radius) {
    const value = tokensMap?.radius[key];
    tokenVariables[`--radius-${key}`] = value;
  }

  for (const key in tokensMap?.colors) {
    const value = tokensMap?.colors[key];

    if (typeof value === "string") {
      tokenVariables[`--colors-${key}`] = value;
    }

    if (typeof value === "object") {
      for (const shade in value) {
        tokenVariables[`--colors-${key}${shade}`] = value[shade];
      }
    }
  }

  return tokenVariables;
};
