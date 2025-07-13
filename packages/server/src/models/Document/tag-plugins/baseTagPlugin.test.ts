import { describe, expect, test } from "vitest";
import * as Fixtures from "./baseFixtures";
import { BaseTagPlugin } from "./baseTagPlugin";

describe("BaseTagPlugin", () => {
  describe("RegEx Test", () => {
    const validate = (testString: string) =>
      BaseTagPlugin.baseValidateTagString(
        `^${BaseTagPlugin.variableRE()}$`,
        Fixtures.mockCommandObject(testString),
      );
    const safeFetchValidate = (testString: string) =>
      BaseTagPlugin.baseValidateTagString(
        `^${BaseTagPlugin.variableRE(true)}$`,
        Fixtures.mockCommandObject(testString),
      );

    test("Base Variable", () => {
      const valResult = validate(Fixtures.baseVariable);
      expect(valResult).toEqual({
        forLoopVariable: undefined,
        id1: "nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977",
        id2: undefined,
      });
    });

    test("Base Variable wit safe fetch", () => {
      const valResult = safeFetchValidate(
        `sf(${Fixtures.baseVariableWithoutFetch})`,
      );
      expect(valResult).toEqual({
        forLoopVariable: undefined,
        id1: "nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977",
        id2: undefined,
      });
    });

    test("Base with for loop", () => {
      const valResult = validate(Fixtures.baseVariablewithForLoop);
      expect(valResult).toEqual({
        forLoopVariable: "$_iterator",
        id1: "nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977",
        id2: undefined,
      });
    });
    test("Variable with child", () => {
      const valResult = validate(Fixtures.variableWithChild);
      expect(valResult).toEqual({
        forLoopVariable: undefined,
        id1: "nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977",
        id2: "input_8a5a9e97-e7a4-43d9-b2de-025611a7875f",
      });
    });
    test("Variable with child and for loop", () => {
      const valResult = validate(
        Fixtures.variableWithChildAndForLoopAndSafeFetch,
      );
      expect(valResult).toEqual({
        forLoopVariable: "$_iterator",
        id1: "nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977",
        id2: "input_8a5a9e97-e7a4-43d9-b2de-025611a7875f",
      });
    });
    test("Invalid node id", () => {
      const valResult = validate("f(76240538-a6d5-4cf1-b213-1cbfdd91f977)");
      expect(valResult).toContain({ name: "Invalid template code" });
    });
    test("Invalid node id", () => {
      const valResult = validate("f(nodes_broken-a6d5-4cf1-b213-1cbfdd91f977)");
      expect(valResult).toContain({ name: "Invalid template code" });
    });
    test("Invalid child id", () => {
      const valResult = validate(
        "f(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977.input_8aXXX5a9e97-e7a4-43d9-b2de-025611a7875f)",
      );
      expect(valResult).toContain({ name: "Invalid template code" });
    });
    test("Missing fetch", () => {
      const valResult = validate("nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977");
      expect(valResult).toContain({ name: "Invalid template code" });
    });
    test("Invalid fetch call - s is not a valid function", () => {
      const valResult = validate(
        "s(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977)",
      );
      expect(valResult).toContain({ name: "Invalid template code" });
    });
    test("Invalid fetch call - safe fetch must be explicitly set", () => {
      const valResult = validate(
        "sf(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977)",
      );
      expect(valResult).toContain({ name: "Invalid template code" });
    });
  });
  describe("Base64", () => {
    test("Encode", () => {
      expect(BaseTagPlugin.toBase64(Fixtures.testStringForBase64)).toBe(
        Fixtures.testStringEncoded,
      );
    });
    test("Decode", () => {
      expect(BaseTagPlugin.fromBase64(Fixtures.testStringEncoded)).toBe(
        Fixtures.testStringForBase64,
      );
    });

    test("Base64 Regex", () => {
      const re = new RegExp(BaseTagPlugin.base64Regex);
      const match = re.test(Fixtures.testStringEncoded);
      expect(match).toBe(true);
    });
  });
});
