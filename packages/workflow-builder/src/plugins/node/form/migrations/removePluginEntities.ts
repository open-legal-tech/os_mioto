import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import { TextInput } from "../inputs/plugins/text/TextInputPlugin";

// export const removePluginEntities: pluginMigrationFn<any> =
//   (treeClient) => (node, yNode) => {
//     const inputs = treeClient.get.treeMap().get("pluginEntities").get("inputs");

//     if (!inputs) throw new Error("No inputs found in tree.");

//     const inputIds = node.inputs;

//     if (!inputIds) {
//       yNode.set("inputs", new Y.Array());
//     }

//     const mappedYInputs =
//       inputIds?.map((inputId: any) => {
//         const input = inputs.get(inputId);

//         if (!input) {
//           throw new Error(`Input ${inputId} not found.`);
//         }

//         if (input.get("type") === "placeholder") {
//           const textInput = TextInput.create({
//             label: input.get("label"),
//             required: input.get("required"),
//           });

//           return new Y.Map(Object.entries(textInput));
//         }

//         return input.clone();
//       }) ?? [];

//     yNode.delete("inputs");
//     yNode.set("inputs", Y.Array.from(mappedYInputs));
//   };

export const removePluginEntities: pluginMigrationFn<any> =
  (treeClient, _, t) => async (node) => {
    console.log(`Move inputs from pluginEntites to node ${node.id}.`);
    const inputs = (treeClient.get.tree() as any)?.pluginEntities?.inputs;

    if (!inputs) throw new Error("No inputs found in tree.");

    if (!node.inputs) {
      node.inputs = [];
    }

    const mappedInputs = node.inputs.map((id: string) => {
      if (typeof id !== "string") return id;
      const input = inputs[id];

      if (!input) {
        throw new Error(`Input ${id} not found.`);
      }

      if (input.type === "placeholder") {
        return TextInput.create({
          label: input.get("label"),
          required: input.get("required"),
          t,
        });
      }

      return input;
    });

    node.inputs = mappedInputs;
  };
