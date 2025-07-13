import { v4 as uuid } from "uuid";
import { createUnproxiedYRichTextFragment } from "../../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { pluginMigrationFn } from "../../../../../tree/type/migrations/createPluginMigration";
import { RecordVariable } from "../../../../../variables/exports/types";
import { ComplexLogicEdge } from "../../../../edge/complex-logic/exports/plugin";
import { FormNode } from "../../exports/plugin";
import { SelectInput } from "../../inputs/plugins/select/SelectInputPlugin";
import type { IDecisionNode } from "../plugin";
import { CompareEdge } from "./CompareEdge";

export const convertToFormNode: pluginMigrationFn<IDecisionNode> =
  (treeClient, _, t) => async (node) => {
    console.log(
      `Migrating ${node.id} by converting the decision node into a form node.`,
    );

    const edges = Object.values(
      CompareEdge.getByNode(node.id)(treeClient)?.source ?? {},
    );

    const tree = treeClient.get.tree();

    const existingInput = node.input
      ? (tree as any)?.pluginEntities?.inputs?.[node.input]
      : undefined;
    const input = existingInput
      ? SelectInput.create({
          ...existingInput,
          yRendererLabel: createUnproxiedYRichTextFragment(
            existingInput.rendererLabel,
          ),
        })
      : SelectInput.create({ required: true, t });

    edges.forEach((edge) => {
      const newEdge = ComplexLogicEdge.transform(edge, {
        conditions: [
          [
            {
              type: "select",
              variablePath: RecordVariable.createVariablePath(
                edge.source,
                input.id,
              ),
              id: uuid(),
              comparator: edge.condition.valueIds,
              operator: "=",
            },
            "none",
          ],
        ],
      })(treeClient);

      treeClient.edges.replace(edge.id, newEdge);
    });

    const newNode = FormNode.create({
      ...node,
      inputs: [input],
      yContent: createUnproxiedYRichTextFragment(node.content),
    })(treeClient);

    treeClient.nodes.replace(node.id, newNode);
  };
