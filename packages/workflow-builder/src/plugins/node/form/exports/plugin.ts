import { CalendarDate } from "@internationalized/date";
import { FatalError } from "@mioto/errors";
import { fromUnixTime } from "date-fns";
// @ts-expect-error - we currently cannot install @types/ramda because that creates a build error of zenstack
import { isEmpty } from "ramda";
import { fromEntries, isDefined, mapValues, omit, pick } from "remeda";
import { P, match } from "ts-pattern";
import { ref } from "valtio";
import { Array as YArray } from "yjs";
import {
  type TYRichText,
  createUnproxiedYRichTextFragment,
} from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TChildId, TNodeId } from "../../../../tree/id";
import { TreeEvent } from "../../../../tree/type/TreeEventEmitter";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
  type duplicateFn,
} from "../../../../tree/type/plugin/NodePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../../tree/type/treeClient";
import {
  DateVariable, EmailVariable,
  FileVariable,
  type IFileVariable,
  type IRecordVariable,
  type IRichTextVariable,
  MultiSelectVariable,
  NumberVariable,
  type PrimitiveVariable,
  RecordVariable,
  RichTextVariable,
  SelectVariable,
  TextVariable,
  type Variable,
  type VariableExecutionStatus
} from "../../../../variables/exports/types";
import {
  GlobalVariablesNode,
  type TGlobalVariableId,
} from "../../global-variables/plugin";
import { convertContentToYContent } from "../../shared/convertContentToYContent";
import type { TInputId } from "../inputs/InputPlugin";
import { addYRendererLabel } from "../migrations/addYRendererLabel";
import { removePluginEntities } from "../migrations/removePluginEntities";
import type { TFormNodeInput } from "./inputPlugins";

export type TFormNodeVariable = IRecordVariable;

export const typeName = "form" as const;

export interface IFormNode extends INode<typeof typeName> {
  inputs: TFormNodeInput[];
  yContent: TYRichText;
}

export class FormNodePlugin extends NodePlugin<IFormNode> {
  readonly hasAction = false;
  readonly hasRenderer = true;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [
        convertContentToYContent("content", "yContent"),
        () => async () => undefined,
        removePluginEntities,
        addYRendererLabel,
      ],
      blockGroup: "data",
    });
  }

  transform =
    <TNewNode extends INode>(node: IFormNode, newNode: TNewNode) =>
    (treeClient: TTreeClient) => {
      return treeClient.nodes.transform<IFormNode, TNewNode>(node, {
        ...pick(node, [
          "position",
          "name",
          "parent",
          "final",
          "rendererButtonLabel",
          "isRemoved",
          "edges",
          "fallbackEdge",
        ]),
        ...newNode,
      });
    };

  create: createFn<IFormNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IFormNode>({
      yContent: createUnproxiedYRichTextFragment(data?.content),
      inputs: [],
      ...data,
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
    }) satisfies IFormNode;
  };

  reorderInputs =
    (nodeId: TNodeId, newInputs: TFormNodeInput[]) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      const yNode = treeClient.nodes.get.yNode(nodeId);

      if (!node) return;

      const inputs = newInputs.map(({ id }) => {
        const inputIndex = node.inputs.findIndex((input) => input.id === id);
        const input = (yNode.get("inputs") as YArray<any>).get(inputIndex);
        return input.clone();
      });

      const yInputs = YArray.from(inputs);

      yNode.set("inputs", yInputs);
    };

  inputs = {
    add:
      (nodeId: TNodeId, input: TFormNodeInput) => (treeClient: TTreeClient) => {
        const node = this.getSingle(nodeId)(treeClient);

        node.inputs.push(input);
      },
    update:
      (
        nodeId: TNodeId,
        oldInput: TFormNodeInput,
        newInput: Omit<TFormNodeInput, "id">,
      ) =>
      (treeClient: TTreeClient) => {
        const node = this.getSingle(nodeId)(treeClient);
        const oldInputIndex = node.inputs.findIndex(
          (input) => input.id === oldInput.id,
        );

        node.inputs[oldInputIndex] = {
          ...mapValues(newInput, (value, key) => {
            if (isEmpty(value) && key in oldInput) {
              return (oldInput as any)[key];
            }

            return value;
          }),
          id: oldInput.id,
        };
      },
    getType:
      <TType extends TFormNodeInput["type"]>(
        nodeId: TNodeId,
        inputId: TInputId,
        type?: TType | TType[],
      ) =>
      (treeClient: TReadOnlyTreeClient | TTreeClient) => {
        const input = this.inputs.get(nodeId, inputId)(treeClient);

        if (
          typeof type === "string"
            ? input.type === type
            : type?.includes(input.type as any)
        ) {
          return input as Extract<TFormNodeInput, { type: TType }>;
        }

        throw new Error(
          `You requested an input of a type ${type}, but the type of the input is ${input.type}.`,
        );
      },
    get:
      (nodeId: TNodeId, inputId: TInputId) =>
      (treeClient: TReadOnlyTreeClient | TTreeClient) => {
        const node = this.getSingle(nodeId)(treeClient);

        const input = node.inputs.find((input) => input.id === inputId);

        if (!input) throw new Error("Input not found");

        return input;
      },
    getYInput:
      (nodeId: TNodeId, inputId: TInputId) =>
      (treeClient: TReadOnlyTreeClient | TTreeClient) => {
        const nodeInputs = treeClient.nodes.get.yNode(nodeId).get("inputs");

        const index = nodeInputs
          .toArray()
          .findIndex((input: any) => input.get("id") === inputId);

        return nodeInputs.get(index);
      },
    delete:
      (nodeId: TNodeId, inputId: TInputId) => (treeClient: TTreeClient) => {
        const node = this.getSingle(nodeId)(treeClient);

        const inputIndex = node.inputs.findIndex(
          (input) => input.id === inputId,
        );
        node.inputs.splice(inputIndex, 1);
      },
    addGlobalVariableReference:
      (globalVariableId: TGlobalVariableId, referenceId: TChildId) =>
      (treeClient: TTreeClient) => {
        const globalVariables = GlobalVariablesNode.getSingle(
          GlobalVariablesNode.id,
        )(treeClient);
        const { childId, recordId } =
          RecordVariable.splitVariableId(referenceId);

        if (!childId)
          throw new Error(
            "No childId found on referenceId. Make sure to pass a valid childId.",
          );

        if (!globalVariables) {
          throw new Error("No global variables found.");
        }

        const input = this.inputs.get(
          recordId,
          childId as TInputId,
        )(treeClient);

        input.globalVariableReferences = globalVariableId;
      },
    removeGlobalVariableReference:
      (nodeId: TNodeId, inputId: TInputId) => (treeClient: TTreeClient) => {
        const globalVariables = GlobalVariablesNode.getSingle(
          GlobalVariablesNode.id,
        )(treeClient);

        if (!globalVariables) {
          throw new Error("No global variables found.");
        }

        const input = this.inputs.get(nodeId, inputId)(treeClient);
        const reference = input.globalVariableReferences;

        if (!reference) return;

        input.globalVariableReferences = undefined;
      },
  };

  private createInputVariable = (
    nodeId: TNodeId,
    input: TFormNodeInput,
    execution: VariableExecutionStatus,
    value?: any,
  ) => {
    return match([input, value])
      .with(
        [{ type: P.union("text", "textarea") }, P.string.optional()],
        ([input, value]) => {
          return TextVariable.create({
            value,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            execution,
          });
        },
      )
      .with(
        [{ type: P.union("email") }, P.string.optional()],
        ([input, value]) => {
          return EmailVariable.create({
            value,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            execution,
          });
        },
      )
      .with(
        [{ type: P.union("rich-text") }, P.any.optional()],
        ([input, value]) => {
          return RichTextVariable.create({
            value,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            execution,
          });
        },
      )
      .with(
        [{ type: "number" }, P.union(P.number, P.string).optional()],
        ([input, value]) => {
          const roundedNumber = Number(value).toFixed(input.roundTo);

          return NumberVariable.create({
            value: roundedNumber,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            execution,
          });
        },
      )
      .with(
        [{ type: "select" }, P.string.optional().or(P.nullish)],
        ([input, value]) => {
          return SelectVariable.create({
            values: input.answers,
            value: value ?? undefined,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            execution,
          });
        },
      )
      .with(
        [
          { type: "multi-select" },
          P.union(P.array(P.string), P.string).optional(),
        ],
        ([input, value]) => {
          return MultiSelectVariable.create({
            values: input.answers,
            value: value ? (Array.isArray(value) ? value : [value]) : undefined,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            execution,
          });
        },
      )
      .with(
        [
          { type: "file" },
          P.optional({
            uuid: P.string,
            fileName: P.string,
            fileType: P.union("pdf", "docx").optional(),
          }),
        ],
        ([input, value]) => {
          let fileType = input?.accept;
          if (!fileType && value?.fileType) {
            fileType = [value.fileType];
          }

          if (!fileType) {
            throw new FatalError({
              code: "missing_file_type",
              debugMessage:
                "The file type is missing. Please provide a file type.",
            });
          }

          return FileVariable.create({
            fileType,
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            status: "ok",
            value: value
              ? { fileName: value.fileName, uuid: value.uuid }
              : undefined,
          });
        },
      )
      .with(
        [
          { type: "date" },
          P.nullish.or(
            P.shape({
              day: P.number,
              month: P.number,
              year: P.number,
            }).optional(),
          ),
        ],
        ([input, value]) => {
          return DateVariable.create({
            id: RecordVariable.createChildIdPath(nodeId, input.id),
            name: input.label,
            value: value
              ? new Date(value.year, value.month - 1, value.day)
              : undefined,
            execution,
          });
        },
      )
      .otherwise(([input, value]) => {
        console.log({ input, value });
        throw new FatalError({
          code: "type_mismatch",
          debugMessage:
            "A type mismatch between the input type and the provided answer value has been detected.",
        });
      });
  };

  private createGlobalValueFromInput = (input: TFormNodeInput, value?: any) => {
    if (input.globalVariableReferences) {
      if (input.type === "number" && input.roundTo) {
        const roundedNumber = Number(value).toFixed(input.roundTo);
        return [input.globalVariableReferences, roundedNumber] as const;
      }
      return [input.globalVariableReferences, value] as const;
    }

    return undefined;
  };

  createVariable: createVariableFn<
    PrimitiveVariable<TChildId> | IFileVariable<TChildId> | IRichTextVariable
  > =
    ({ nodeId, execution: executionStatus = "unexecuted", value: answer }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      const variables =
        node.inputs?.map((input) => {
          const answerValue = answer?.[input.id];

          const variableValue = this.createInputVariable(
            node.id,
            input,
            executionStatus,
            Number.isNaN(answerValue) || answerValue?.length === 0
              ? undefined
              : answerValue,
          );

          return variableValue;
        }) ?? [];

      const localVariable = RecordVariable.create({
        value: variables,
        name: node.name,
        id: nodeId,
        status: node.isRemoved ? "missing" : "ok",
        execution: executionStatus,
      });

      const globalVariables = fromEntries(
        (node.inputs ?? [])
          ?.map((input) => {
            const answerValue = answer?.[input.id];
            const globalVariableValue = this.createGlobalValueFromInput(
              input,
              answerValue,
            );

            return globalVariableValue;
          })
          .filter(isDefined),
      );

      const globalVariable =
        Object.values(globalVariables).length > 0
          ? GlobalVariablesNode.createVariableUpdate({
              values: globalVariables,
              nodeId: GlobalVariablesNode.id,
              treeClient,
            })
          : undefined;

      return {
        variable: localVariable,
        globalVariable: globalVariable,
      };
    };

  private createFormVariable = (
    ...params: Parameters<typeof this.createInputVariable>
  ) => {
    const variable = this.createInputVariable(...params);

    if (variable.type === "date") {
      return {
        ...variable,
        value: variable.value ? fromUnixTime(variable.value) : undefined,
      };
    }

    return variable;
  };

  createDefaultValues = (
    node: IFormNode,
    inputs: TFormNodeInput[],
    previousVariable?: Variable,
  ) => {
    if (!node.inputs) return;

    if (previousVariable && previousVariable.type !== "record") return;

    return fromEntries(
      inputs
        .map((input) => {
          const inputVariable = this.createFormVariable(
            node.id,
            input,
            "unexecuted",
          );

          const previousValue = previousVariable?.value[inputVariable.id];

          if (previousValue?.value && previousValue?.type === "date") {
            const date = fromUnixTime(previousValue.value);

            return [
              input.id,
              new CalendarDate(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
              ),
            ] as [string, any];
          }

          return [input.id, previousValue?.value ?? inputVariable.value] as [
            string,
            any,
          ];
        })
        .filter(isDefined),
    );
  };

  override duplicate: duplicateFn<IFormNode> = (nodeId) => (treeClient) => {
    const node = treeClient.nodes.get.single<IFormNode>(nodeId);

    return this.create({
      ...omit(node, [
        "edges",
        "fallbackEdge",
        "id",
        "isRemoved",
        "position",
        "name",
      ]),
      yContent: ref(node.yContent.clone()),
      inputs: node.inputs.map((input) => ({
        ...input,
        yRendererLabel: ref(input.yRendererLabel.clone()),
      })),
      name: `${
        typeof node.name === "string" ? node.name.trimEnd() : node.name
      } Kopie`,
      position: {
        x: node.position.x + 260,
        y: node.position.y,
      },
    })(treeClient);
  };

  updateRendererButtonLabel =
    (nodeId: TNodeId, newLabel?: string) => (treeClient: TTreeClient) => {
      const node = treeClient.nodes.get.single<
        INode & { rendererButtonLabel?: string }
      >(nodeId);

      if (!newLabel) {
        node.rendererButtonLabel = undefined;
      }

      node.rendererButtonLabel = newLabel;
    };

  removeGlobalVariable =
    (nodeId: TNodeId, globalVariableId: TGlobalVariableId) =>
    (treeClient: TTreeClient) => {
      const node = this.getSingle(nodeId)(treeClient);

      if (!node.inputs) return;

      node.inputs.forEach((input) => {
        if (input.globalVariableReferences === globalVariableId) {
          input.globalVariableReferences = undefined;
        }
      });
    };

  override subscribeToTreeEvents = (treeClient: TTreeClient) => {
    return TreeEvent.on(["onGlobalVariableRemove"], ({ variableId }) => {
      const nodes = this.getAll(treeClient);

      Object.values(nodes).forEach((node) => {
        this.removeGlobalVariable(node.id, variableId)(treeClient);
      });
    });
  };
}

export const FormNode = new FormNodePlugin();
