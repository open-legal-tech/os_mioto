"use client";

import Badge from "@mioto/design-system/Badge";
import { Button } from "@mioto/design-system/Button";
import { Combobox } from "@mioto/design-system/Combobox";
import { Row } from "@mioto/design-system/Row";
import { Select } from "@mioto/design-system/Select";
import {
  SelectWithCombobox,
  type SelectWithComboboxProps,
} from "@mioto/design-system/SelectWithCombobox";
import { menuItemClasses } from "@mioto/design-system/classes/menuClasses";
import { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import { pick } from "remeda";
import { type TNodeId, ZNodeId } from "../../tree/id";
import { useTreeClient } from "../../tree/sync/state";
import type { IEdge } from "../../tree/type/plugin/EdgePlugin";
import type { TTreeClient } from "../../tree/type/treeClient";
import { NodeDropdown } from "./NodeDropdown";
import { NodeTypeIcon } from "./NodeTypeIcon";

export type onEdgeCreate<TFailure extends Failure> = (
  data: Pick<IEdge, "source" | "target">,
) => (treeClient: TTreeClient) => IEdge | TFailure;

// Define a helper type to extract the error type
export type ExtractFailure<T> = T extends (
  data: Pick<IEdge, "source" | "target">,
) => (treeClient: TTreeClient) => infer R
  ? Exclude<R, IEdge>
  : never;

// Modify the TargetSelectorProps type to infer TFailure
export type TargetSelectorProps<
  TFailure extends Failure = Failure,
  TOnEdgeCreate extends onEdgeCreate<TFailure> = onEdgeCreate<TFailure>,
> = {
  targetNodeName: string;
  nodeId: TNodeId;
  inputClassName?: string;
  className?: string;
  edge?: IEdge;
  onEdgeCreate: TOnEdgeCreate;
  onTargetUpdate?: (newTarget?: string) => void;
  onFailure?: (failure: ExtractFailure<TOnEdgeCreate>) => void;
  ariaLabel?: string;
} & Pick<SelectWithComboboxProps, "options" | "id">;

export const TargetSelector = <
  TFailure extends Failure,
  TOnEdgeCreate extends onEdgeCreate<TFailure>,
>({
  targetNodeName,
  edge,
  nodeId,
  onEdgeCreate,
  onTargetUpdate,
  onFailure,
  inputClassName,
  options,
  id,
  ariaLabel,
}: TargetSelectorProps<TFailure, TOnEdgeCreate>) => {
  const { treeClient } = useTreeClient();
  const t = useTranslations();

  return (
    <SelectWithCombobox
      aria-label={ariaLabel}
      value={targetNodeName}
      id={id}
      CreateItem={({ value, store }) => {
        return (
          <NodeDropdown
            onSelect={(plugin) => {
              const childNode = treeClient.nodes.create.childNode(
                nodeId,
                plugin.create({ name: value })(treeClient),
              );

              if (!childNode) return;

              const newEdge = onEdgeCreate({
                source: nodeId,
                target: childNode.id,
              })(treeClient);

              if (newEdge instanceof Failure) {
                return onFailure?.(newEdge as ExtractFailure<TOnEdgeCreate>);
              }

              if (!edge) {
                treeClient.edges.add(newEdge);
              } else {
                treeClient.edges.update(
                  edge.id,
                  pick(newEdge, ["source", "target"]),
                );
              }

              treeClient.nodes.add(childNode);
              store.hide();
            }}
            align="start"
          >
            <Button
              variant="tertiary"
              className={menuItemClasses("justify-between my-2 font-weak")}
            >
              {value}
              <Badge>
                {t("packages.node-editor.target-selector.create-item.badge")}
              </Badge>
            </Button>
          </NodeDropdown>
        );
      }}
      Item={({ item, key, store }) => {
        return (
          <Combobox.Item
            className="mx-0"
            focusOnHover
            key={key}
            onClick={() => {
              const parsedTarget = ZNodeId.safeParse(item.id);

              if (!parsedTarget.success) return;

              const newEdge = onEdgeCreate({
                source: nodeId,
                target: parsedTarget.data,
              })(treeClient);

              if (newEdge instanceof Failure) {
                // This typecast is necessary to tell Typescript, that we are sure about the specific type
                // of Failure here.
                return onFailure?.(newEdge as ExtractFailure<TOnEdgeCreate>);
              }

              if (!edge) {
                treeClient.edges.add(newEdge);
              } else {
                treeClient.edges.update(
                  edge.id,
                  pick(newEdge, ["source", "target"]),
                );
              }

              store.hide();

              return onTargetUpdate?.(item.id);
            }}
          >
            <NodeTypeIcon type={item.data.type} />
            {item.name}
          </Combobox.Item>
        );
      }}
      options={options}
      ComboboxInput={(props) => (
        <Combobox.Input
          {...props}
          placeholder={t(
            "packages.node-editor.target-selector.combobox.placeholder",
          )}
        />
      )}
      SelectInput={(props) => (
        <Select.Input
          {...props}
          placeholder={t(
            "packages.node-editor.target-selector.select.placeholder",
          )}
          className={inputClassName}
        />
      )}
      comboboxListProps={{
        "aria-label": t(
          "packages.node-editor.target-selector.combobox.list.aria-label",
        ),
      }}
      renderItem={({ item }) => {
        const node = treeClient.nodes.get.single(item.id as TNodeId);

        return (
          <Row className="gap-2 flex-1 items-center">
            <NodeTypeIcon type={node.type} className="p-1" />
            {item.name}
          </Row>
        );
      }}
    />
  );
};
