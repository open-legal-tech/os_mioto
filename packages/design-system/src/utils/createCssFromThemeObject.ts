export const createCssFromThemeObject = (tokensMap: any, name: string) => {
  let tokenVariableStrings = `.${name} {\n`;

  for (const key in tokensMap?.space) {
    const value = tokensMap?.space[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--space${key}: ${value};\n`,
    );
  }

  tokenVariableStrings = tokenVariableStrings.concat(
    `--fontFamily-heading: var(--fontFamily-${tokensMap?.fontFamily?.heading}, system-ui);\n`,
  );
  tokenVariableStrings = tokenVariableStrings.concat(
    `--fontFamily-text: var(--fontFamily-${tokensMap?.fontFamily?.text}, system-ui);\n`,
  );

  for (const key in tokensMap?.fontSize) {
    const value = tokensMap?.fontSize[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--fontSize-${key}: ${value};\n`,
    );
  }

  for (const key in tokensMap?.fontWeight) {
    const value = tokensMap.fontWeight[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--fontWeight-${key}: ${value};\n`,
    );
  }

  for (const key in tokensMap?.lineHeight) {
    const value = tokensMap?.lineHeight[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--lineHeight-${key}: ${value};\n`,
    );
  }

  for (const key in tokensMap?.letterSpacing) {
    const value = tokensMap?.letterSpacing[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--letterSpacing-${key}: ${value};\n`,
    );
  }

  for (const key in tokensMap?.shadow) {
    const value = tokensMap?.shadow[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--shadow${key}: ${value};\n`,
    );
  }

  for (const key in tokensMap?.radius) {
    const value = tokensMap?.radius[key];
    tokenVariableStrings = tokenVariableStrings.concat(
      `--radius-${key}: ${value};\n`,
    );
  }

  for (const key in tokensMap?.colors) {
    const value = tokensMap?.colors[key];

    if (typeof value === "string") {
      tokenVariableStrings = tokenVariableStrings.concat(
        `--colors-${key}: ${value};\n`,
      );
    }

    if (typeof value === "object") {
      for (const shade in value) {
        tokenVariableStrings = tokenVariableStrings.concat(
          `--colors-${key}${shade}: ${value[shade]};\n`,
        );
      }
    }
  }

  tokenVariableStrings.concat(`}`);

  return tokenVariableStrings;
};
