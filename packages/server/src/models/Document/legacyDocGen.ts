import { Failure } from "@mioto/errors";
import Docxtemplater from "docxtemplater";
import expressionParser from "docxtemplater/expressions.js";
import InspectModule from "docxtemplater/js/inspect-module.js";
import PizZip from "pizzip";
import { filter, isIncludedIn, pathOr } from "remeda";
import type * as generateHandler from "./generate";
import { TemplateFailure } from "./shared";

function customAngularParser(tag: string) {
  if (tag.includes("| contains")) {
    const [variableName, elementsString] = tag.split("| contains:");
    const elements =
      // This type cast is safe, because we know that the string contains an array.
      (JSON.parse(`[${elementsString?.replace(/'/g, '"')}]`) as string[]).map(
        (x) => x.trim(),
      );

    return {
      get: (scope: any, _context: any) => {
        const variablePath = variableName?.split(".").map((x) => x.trim()) as [
          string,
        ];
        const variableValue = pathOr(scope, variablePath, undefined);

        if (filter(elements, isIncludedIn(variableValue)).length > 0) {
          return true;
        }

        return false;
      },
    };
  }

  return expressionParser(tag);
}

export function nullGetter(): any {
  return "";
}

export const generate = (
  variables: generateHandler.TInput["variables"],
  docTemplate: Buffer,
) => {
  const zip = new PizZip(docTemplate);

  try {
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: customAngularParser,
      nullGetter: nullGetter,
    });

    doc.render(variables);

    const buf: Buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    return buf;
  } catch (error: any) {
    if (Array.isArray(error?.properties?.errors)) {
      const errors = error.properties.errors.map((e: any) => ({
        name: e?.name,
        message: e?.message,
        tag: e?.properties?.xtag ?? undefined,
        explanation: e?.properties?.explanation,
      }));

      return TemplateFailure(errors);
    }

    return new Failure({ code: "doc_gen_failure" });
  }
};

export const validate = (docTemplate: Buffer) => {
  const zip = new PizZip(docTemplate);

  const iModule = new InspectModule();

  let tags = {};

  try {
    new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: customAngularParser,
      modules: [iModule],
    });

    tags = iModule.getAllTags();

    return { isValid: true, variables: tags };
  } catch (error: any) {
    if (Array.isArray(error?.properties?.errors)) {
      const errors = error.properties.errors.map((e: any) => ({
        name: e?.name,
        message: e?.message,
        tag: e?.properties?.xtag ?? undefined,
        explanation: e?.properties?.explanation,
      }));

      return TemplateFailure(errors);
    }
  }

  return;
};
