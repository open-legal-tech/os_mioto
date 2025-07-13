import { BUILT_IN_COMMANDS } from "docx-templates/lib/types";
export const baseVariable = "f(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977)";
export const baseVariableWithoutFetch =
  "nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977";
export const baseVariablewithForLoop =
  "f($nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977)";
export const variableWithChild =
  "f(nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977.input_8a5a9e97-e7a4-43d9-b2de-025611a7875f)";
export const variableWithChildAndForLoopAndSafeFetch =
  "f($nodes_76240538-a6d5-4cf1-b213-1cbfdd91f977.input_8a5a9e97-e7a4-43d9-b2de-025611a7875f)";
export const testStringForBase64 = "ThisIsATest!";
export const testStringEncoded = "VGhpc0lzQVRlc3Qh";

export const mockCommandObject = (testString: string) => {
  return {
    raw: testString,
    code: testString,
    type: BUILT_IN_COMMANDS[7],
  };
};
