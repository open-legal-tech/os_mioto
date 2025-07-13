import { pick } from "remeda";
import { TemplateTagGenerationFailure } from "../shared";
import {
  BaseTagPlugin,
  type IGenerateTag,
  type IValidateTagString,
  type generateTagString,
} from "./baseTagPlugin";

// TODO: not using strict equality here as we are using a lot of strings which makes number use their type
export const LogicOperators = {
  EQUALS: "==",
  NOT: "!=",
  GT: ">",
  GTE: ">=",
  LT: "<",
  LTE: "<=",
};

export class IfCompareTagPlugin extends BaseTagPlugin {
  name = "IF_COMPARE_PLUGIN";
  logicOperators = LogicOperators;

  /*
 Specific regexes for this plugin
 */
  logicOperatorsRE = `(${Object.values(this.logicOperators).join("|")})`;

  // Matches floats and integers
  numberRegex = "[+-]?(\\d+(\\.\\d*)?|\\d+\\.\\d*)";

  safeRegex = `^IF ${BaseTagPlugin.variableRE(true)} ${
    this.logicOperatorsRE
  } '${BaseTagPlugin.base64Regex}'$`;

  closingTagRegex = "^END-IF$";
  /*
 _______________________
 */
  regex = `^IF ${BaseTagPlugin.variableRE()} ${this.logicOperatorsRE} ${
    this.numberRegex
  }$`;

  generateTagString: generateTagString<IGenerateIfCompareTag> = ({
    varPath,
    refersToLoopIterator,
    data: { logicOperator, compareValue },
  }) => {
    // Check if the compareValue is a number-like value
    const isNumber = new RegExp(`^${this.numberRegex}$`).test(compareValue);
    const varDescriptor = this.getVariableDescriptor({
      varPath,
      refersToLoopIterator,
    });

    // If the compare value is a number, we insert the number value and use the normal fetch function
    if (isNumber) {
      return [
        `IF f(${varDescriptor}) ${logicOperator} ${compareValue}`,
        "END-IF",
      ];
    }
    // If its a string, encode it with Base64 and use safe-fetch for the variable
    // reject if the logic operator is not valid for string operations
    if (!Object.values(StringLogicOperators).includes(logicOperator)) {
      // TODO how to type the return in the base plugin
      return TemplateTagGenerationFailure({
        name: "Invalid_logic_operator",
        message: "The operator is not valid on strings",
      });
    }
    const encodedCompareValue = BaseTagPlugin.toBase64(compareValue);
    return [
      `IF sf(${varDescriptor}) ${logicOperator} '${encodedCompareValue}'`,
      "END-IF",
    ];
  };

  validateTagString = ({ command }: IValidateTagString) => {
    const regexes = [this.regex, this.safeRegex, this.closingTagRegex];

    for (const re in regexes) {
      const validationResult = BaseTagPlugin.baseValidateTagString(re, command);
      if (validationResult && !validationResult.message)
        return { isValid: true, variables: validationResult };
    }
    return { isValid: false };
  };
}

type IGenerateIfCompareTag = IGenerateTag<{
  logicOperator: valueof<typeof LogicOperators>;
  compareValue: string;
}>["data"];

export const StringLogicOperators = pick(LogicOperators, ["EQUALS", "NOT"]);

type valueof<T> = T[keyof T];
