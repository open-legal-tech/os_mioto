import { type Download, expect } from "@playwright/test";
import { extractText } from "../hashFile";

/**
 * Takes a downloaded file and an origin and compares there
 * text directly.
 */
export const compareFileAgainstOrigin = async (
  download: Download,
  originFilePath: string,
) => {
  const downloadPath = await download.path();

  if (!downloadPath) {
    throw new Error("Download path is undefined");
  }

  const extractedText1 = extractText(originFilePath);
  const extractedText2 = extractText(downloadPath);

  expect(extractedText1).toEqual(extractedText2);
};
