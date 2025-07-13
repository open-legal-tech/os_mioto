import crypto from "node:crypto";
import fs from "node:fs";
import { nullGetter } from "@mioto/server/Document/legacyDocGen";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

export function extractText(filePath: string) {
  const content = fs.readFileSync(filePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);
  return doc.getFullText();
}

export function renderText(filePath: string, data: any) {
  const content = fs.readFileSync(filePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { nullGetter });

  return doc.render(data).getFullText();
}

export function hashFile(text: string) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex");
}
