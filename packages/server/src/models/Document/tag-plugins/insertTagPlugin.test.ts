import { BUILT_IN_COMMANDS } from "docx-templates/lib/types";
import { describe, expect, test } from "vitest";
import * as BaseFixtures from "./baseFixtures";
import { InsertTagPlugin } from "./insertTagPlugin";

const mockIfCommandObject = (testString: string) => {
  return {
    raw: `INS ${testString}`,
    code: testString,
    type: BUILT_IN_COMMANDS[7],
  };
};

describe("Insert Plugin", () => {
  describe("Generate Tag", () => {
    const instance = new InsertTagPlugin();

    test("Generate basic tag", () => {
      const generatedTag = instance.generateTagString({
        varPath: [BaseFixtures.baseVariableWithoutFetch],
        data: {},
      });
      expect(generatedTag).toStrictEqual([
        `INS f(${BaseFixtures.baseVariableWithoutFetch})`,
      ]);
    });
  });

  describe("Validate Tag", () => {
    const instance = new InsertTagPlugin();

    test("Validate valid tag", () => {
      const mockCommand = mockIfCommandObject(BaseFixtures.variableWithChild);
      const validationResult = instance.validateTagString({
        command: mockCommand,
      });

      expect(validationResult).toHaveProperty("isValid", true);
    });

    test("Missing fetch call", () => {
      const mockCommand = mockIfCommandObject(
        BaseFixtures.baseVariableWithoutFetch,
      );
      const validationResult = instance.validateTagString({
        command: mockCommand,
      });

      expect(validationResult).toStrictEqual({ isValid: false });
    });
  });
});
