import { BUILT_IN_COMMANDS } from "docx-templates/lib/types";
import { describe, expect, test } from "vitest";
import * as BaseFixtures from "./baseFixtures";
import { IfExistsTagPlugin } from "./ifExistsTagPlugin";

const mockIfCommandObject = (testString: string) => {
  return {
    raw: `IF ${testString}`,
    code: testString,
    type: BUILT_IN_COMMANDS[5],
  };
};

describe("If Exists Plugin", () => {
  describe("Generate Tag", () => {
    const instance = new IfExistsTagPlugin();

    test("Generate basic tag", () => {
      const generatedTag = instance.generateTagString({
        varPath: [BaseFixtures.baseVariableWithoutFetch],
        data: {},
      });
      expect(generatedTag).toStrictEqual([
        `IF f(${BaseFixtures.baseVariableWithoutFetch})`,
      ]);
    });
  });

  describe("Validate Tag", () => {
    const instance = new IfExistsTagPlugin();

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
