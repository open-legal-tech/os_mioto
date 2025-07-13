import { Failure } from "@mioto/errors";
import { BUILT_IN_COMMANDS } from "docx-templates/lib/types";
import { describe, expect, test } from "vitest";
import * as BaseFixtures from "./baseFixtures";
import { IfCompareTagPlugin, LogicOperators } from "./ifCompareTagPlugin";

const mockIfCommandObject = (testString: string) => {
  return {
    raw: `IF ${testString}`,
    code: testString,
    type: BUILT_IN_COMMANDS[5],
  };
};

describe("If Compare Plugin", () => {
  describe("Generate Tag", () => {
    const instance = new IfCompareTagPlugin();

    test("Generate Tag with equals string", () => {
      const generatedTag = instance.generateTagString({
        varPath: [BaseFixtures.baseVariableWithoutFetch],
        data: {
          logicOperator: LogicOperators.EQUALS,
          compareValue: "Potentially dangerous string",
        },
      });
      expect(generatedTag).toStrictEqual([
        "IF sf(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977) == 'UG90ZW50aWFsbHkgZGFuZ2Vyb3VzIHN0cmluZw=='",
        "END-IF",
      ]);
    });

    test("Generate Tag with number", () => {
      const generatedTag = instance.generateTagString({
        varPath: [BaseFixtures.baseVariableWithoutFetch],
        data: {
          logicOperator: LogicOperators.GTE,
          compareValue: "4234.5",
        },
      });
      expect(generatedTag).toStrictEqual([
        "IF f(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977) >= 4234.5",
        "END-IF",
      ]);
    });

    test("Crash with invalid string tag operation", () => {
      const generationResult = instance.generateTagString({
        varPath: [BaseFixtures.baseVariableWithoutFetch],
        data: {
          logicOperator: LogicOperators.GT,
          compareValue: "Potentially dangerous string",
        },
      });
      expect(generationResult instanceof Failure).toBe(true);
    });
  });
  describe("Validate Tag", () => {
    const instance = new IfCompareTagPlugin();

    test("Validate valid safe tag", () => {
      const mockCommand = mockIfCommandObject(
        "sf(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977) == 'UG90ZW50aWFsbHkgZGFuZ2Vyb3VzIHN0cmluZw=='",
      );
      const validationResult = instance.validateTagString({
        command: mockCommand,
      });

      expect(validationResult).toHaveProperty("isValid", true);
    });

    test("Validate valid unsafe tag", () => {
      const mockCommand = mockIfCommandObject(
        "f(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977) < 423454",
      );
      const validationResult = instance.validateTagString({
        command: mockCommand,
      });

      expect(validationResult).toHaveProperty("isValid", true);
    });

    test("Invalid safe tag", () => {
      // Note: this is only invalid due to the exclaimation mark  in the string
      const mockCommand = mockIfCommandObject(
        "sf(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977) == 'Potentially dangerous string!'",
      );
      const validationResult = instance.validateTagString({
        command: mockCommand,
      });

      expect(validationResult).toStrictEqual({ isValid: false });
    });

    test("Validate invalid unsafe tag", () => {
      const mockCommand = mockIfCommandObject(
        "f(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977) != 'Potentially dangerous string!'",
      );
      const validationResult = instance.validateTagString({
        command: mockCommand,
      });

      expect(validationResult).toStrictEqual({ isValid: false });
    });
  });
});
