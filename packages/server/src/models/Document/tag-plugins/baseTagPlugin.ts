import type { CommandSummary } from "docx-templates/lib/types";
import { Base64 } from "js-base64";
import type { TTemplateError, TemplateTagGenerationFailure } from "../shared";

export abstract class BaseTagPlugin {
  abstract name: string;
  abstract regex: string;

  /*
______________________________________________
Genereal Regular Expressions
*/
  // This matches a UUIDv4, from zod https://github.com/colinhacks/zod/blob/5e23b4fae4715c7391f9ceb4369421a034851b4c/src/types.ts#L546
  static readonly uuidRegex =
    "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";

  /***
    To refer to a variable relative to the current element being processed in a for loop, the library requires a '$' as a prefix to a variable
    as this is optional, it uses the '?' quantifier (zero or once)
    also see https://github.com/guigrpa/docx-templates#for-and-end-for
    */
  static readonly forLoopPrefixRegex = "(?<forLoopVariable>\\$_iterator)?";

  /***
    To inject the correct variables in the template tags, we use fetch & safeFetch functions that are inhjected via the additionalJsContext option
    to the document generation.
    */
  // Default fetch function: get the variable value
  static readonly wrapInFetchRegex = (varToWrap: string) =>
    `f\\(${varToWrap}\\)`;

  // Safe fetch gets the variable value but encoded as Base64 (see comment below for context)
  static readonly wrapInSafeFetchRegex = (varToWrap: string) =>
    `sf\\(${varToWrap}\\)`;

  /*
    For security reasons, we want to avoid to process (eval) user-provided strings we cannot fully check as sanitization is hard.
    Therefore for template features like "if (answer === userProvidedString)" we therefore encode the string in Base64 to prevent
    any string escapes or code injections.
    */
  static readonly base64Regex = "[-A-Za-z0-9+/]*={0,3}";

  static readonly baseRE = `${this.forLoopPrefixRegex}(?<id1>
    nodes_${this.uuidRegex}
  )(?:.(?<id2>input_${this.uuidRegex}))?`;

  //This matches a variable consisting out of a single or two UUIDv4
  static readonly variableRE = (safeFetch = false) => {
    return safeFetch
      ? this.wrapInSafeFetchRegex(this.baseRE)
      : this.wrapInFetchRegex(this.baseRE);
  };

  /*
______________________________________________
*/

  getVariableDescriptor = ({
    varPath,
    refersToLoopIterator,
  }: IGetVariableDescriptor) => {
    /*
  To refer to a variable relative to the current element being processed in a for loop, the library requires a '$' as a prefix to a variable
  also see https://github.com/guigrpa/docx-templates#for-and-end-for
  */
    if (refersToLoopIterator) {
      return `$iterator_${varPath.join(".")}`;
    }
    return varPath.join(".");
  };

  static toBase64 = (stringToEncode: string) => Base64.encode(stringToEncode);
  static fromBase64 = (stringToDecode: string) => Base64.decode(stringToDecode);

  static baseValidateTagString = (regex: string, command: CommandSummary) => {
    // Take the Regex and remove all whitespaces inserted for readability. Use the global flag to allow usage of matchAll
    // FIXME: using the g flag here leads to problems with ifCompare, we should generally try to avoid it
    const re = new RegExp(regex.replace(/\s/g, ""), "ig");
    // Take the string and remove all whitespaces inserted for readability
    const normalizedString = command.raw.replace(/\s/g, "");
    const [...matches] = normalizedString.matchAll(re);
    if (matches && matches.length === 1) {
      return matches[0]?.groups;
      // FIXME this needs proper typing, handling and testing
    }
    return {
      name: "Invalid template code",
      message: `The code ${command.code} is currently not allowed.`,
      tag: command.raw,
    } as TTemplateError;
  };
  abstract generateTagString: generateTagString<any>;
  abstract validateTagString: validateTagString;
}

export interface IGenerateTag<TData> {
  varPath: string[];
  refersToLoopIterator?: boolean;
  data: TData;
}

export interface IGetVariableDescriptor {
  varPath: string[];
  refersToLoopIterator?: boolean;
}

export interface IValidateTagString {
  command: CommandSummary;
}

export interface IGetVariable {
  varPath: string[];
}

export type generateTagString<TParams = any> = (
  params: IGenerateTag<TParams>,
) => string[] | ReturnType<typeof TemplateTagGenerationFailure>;

export type validateTagString = (params: IValidateTagString) => {
  isValid: boolean;
  // FIXME: add proper typing for extracted variables
  variables?: any;
  // variables: [
  //   { varPath: string[]; refersToLoopIterator: boolean; type?: string }
  // ];
};
