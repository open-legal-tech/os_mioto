import { getNodeType, objectIncludes } from "@tiptap/core";
import type { Node, NodeType } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";

export interface LastActiveNodesItemOption {
  type: NodeType | string | null;
  attributes?: any;
  key?: string;
}

export default function lastActiveNodes(
  state: EditorState,
  typesOrGroup: LastActiveNodesItemOption[] | string,
): string[] {
  const { from, to } = state.selection;
  let types: LastActiveNodesItemOption[];

  if (typeof typesOrGroup === "string") {
    // types is a name of a node group
    types = Object.entries(state.schema.nodes)
      .filter(([_, nodeType]) =>
        (nodeType as any).groups.includes(typesOrGroup),
      )
      .map(([_, nodeType]) => {
        return {
          type: nodeType as NodeType,
        };
      });
  } else {
    // types is a list of LastActiveNodeItemOption
    types = typesOrGroup;
    for (const item of types) {
      item.type = item.type ? getNodeType(item.type, state.schema) : null;
    }
  }

  let lastNode: Node | null = null;
  let lastMatchedType: LastActiveNodesItemOption | null = null;
  const matchedTypes: Set<LastActiveNodesItemOption> = new Set();
  const notFoundTypes = new Set(types);

  state.doc.nodesBetween(from, to, (node, _, parent) => {
    if (notFoundTypes.size === 0) return;
    if (!node.isText) {
      const matchedType = types
        .filter((item) => {
          if (!item.type) {
            return true;
          }
          if (typeof item.type === "string") return false; // Typeguard, shouldn't happen
          return node.type.name === item.type.name;
        })
        .find((item) => {
          if (!item.attributes) return true;
          return objectIncludes(node.attrs, item.attributes);
        });
      if (matchedType) {
        if (lastMatchedType && lastNode && lastNode !== parent) {
          notFoundTypes.delete(lastMatchedType);
          matchedTypes.add(lastMatchedType);
        }
        lastMatchedType = matchedType;
      }
      lastNode = node;
    }
  });

  if (lastMatchedType) {
    matchedTypes.add(lastMatchedType);
  }

  return [...matchedTypes.values()].map((item) => {
    if (item.key) {
      return item.key;
    }
    if (typeof item.type === "string") {
      return item.type;
    }
    if (item.type?.name) {
      return item.type.name;
    }
    return "";
  });
}
