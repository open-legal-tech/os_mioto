import {
  menuContainerClasses,
  menuItemClasses,
  menuLabelClasses,
} from "@mioto/design-system/classes/menuClasses";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import type { Editor } from "@tiptap/core";
import { matchSorter } from "match-sorter";
import React from "react";
import {
  type AriaListBoxProps,
  type Key,
  mergeProps,
  useFocusRing,
  useListBox,
  useListBoxSection,
  useOption,
} from "react-aria";
import { type ListState, type Node, useListState } from "react-stately";
import { Item, Section } from "react-stately";
import { VariableTypeIcon } from "../../../editor/components/NodeTypeIcon";
import type { TNodeId } from "../../../tree/id";
import type {
  IFileVariable,
  IRecordVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
import { filterVariables } from "../../../variables/utils/filterVariables";
import type { VariableExtensionsParams } from "../../types/VariablePlugins";
import type { Command, Group } from "./types";

const isGroup = (group: Node<any>): group is Node<Group> => {
  return group.type === "section";
};

const isCommand = (item: Node<any>): item is Node<Command> => {
  return item.type === "item";
};

function filterCommands({
  query,
  variables,
  fileVariables,
  editor,
  richTextVariables,
  groups,
}: {
  query: string;
  variables: Record<TNodeId, IRecordVariable<PrimitiveVariable>>;
  fileVariables: Record<TNodeId, IRecordVariable<IFileVariable>>;
  richTextVariables: Record<TNodeId, IRecordVariable<IRichTextVariable>>;
  editor: Editor;
  groups: Group[];
}): Group[] {
  if (query.startsWith("@")) {
    const [, variableQuery] = query.split("@");

    return matchSorter(
      Object.values(variables).map((variable) => {
        return {
          id: `section:${variable.name}`,
          name: variable.name,
          children: Object.values(variable.value ?? []).map((value) => ({
            id: `item:variable:${value.id}`,
            action: (editor) =>
              editor.commands.setVariable({ type: "mention", id: value.id }),
            description: `Füge die Variable ${value.name} von Block ${variable.name} ein.`,
            Icon: <VariableTypeIcon type={value.type} />,
            name: value.name,
          })),
        };
      }),
      variableQuery ?? "",
      {
        keys: [
          (item) => [
            item.name,
            ...Object.values(item.children ?? []).map((value) => value.name),
          ],
        ],
      },
    );
  }

  if (query.startsWith("rich-text")) {
    const [, variableQuery] = query.split("rich-text");

    return matchSorter(
      Object.values(richTextVariables).map((variable) => {
        return {
          id: `section:${variable.name}`,
          name: variable.name,
          children: Object.values(variable.value ?? []).map((value) => ({
            id: `item:variable:${value.id}`,
            action: (editor) => editor.commands.setRichText(value),
            description: `Füge die formatierte Textvariable ${value.name} von Block ${variable.name} ein.`,
            Icon: <VariableTypeIcon type={value.type} />,
            name: value.name,
          })),
        };
      }),
      variableQuery ?? "",
      {
        keys: [
          (item) => [
            item.name,
            ...Object.values(item.children ?? []).map((value) => value.name),
          ],
        ],
      },
    );
  }

  const filePreviewRegex = /^(file:p(?:r(?:e(?:v(?:i(?:e(?:w)?)?)?)?)?)?)/;
  if (filePreviewRegex.test(query)) {
    const [, , variableQuery] = query.split(filePreviewRegex);

    const pdfFileVariables = filterVariables({
      filterPrimitives: (variable): variable is IFileVariable => {
        if (variable.type !== "file") return false;

        if (typeof variable.fileType === "string")
          return variable.fileType === "pdf";

        if (Array.isArray(variable.fileType))
          return (
            variable.fileType.includes("pdf") && variable.fileType.length === 1
          );

        return false;
      },
    })(fileVariables);

    return matchSorter(
      Object.values(pdfFileVariables).map((variable) => {
        return {
          id: `section:${variable.name}`,
          name: variable.name,
          children: Object.values(variable.value ?? []).map((value) => ({
            id: `item:variable:${value.id}`,
            action: (editor) =>
              // @ts-ignore
              editor.commands.setFilePreviewVariable({ id: value.id }),
            description: `Füge die Dateivariable ${value.name} von Block ${variable.name} als Vorschau ein.`,
            Icon: <VariableTypeIcon type={value.type} />,
            name: value.name,
          })),
        };
      }),
      variableQuery ?? "",
      {
        keys: [
          (item) => [
            item.name,
            ...Object.values(item.children ?? []).map((value) => value.name),
          ],
        ],
      },
    );
  }

  const fileLinkRegex = /^(file:l(?:i(?:n(?:k)?)?)?)/;
  if (fileLinkRegex.test(query)) {
    const [, , variableQuery] = query.split(fileLinkRegex);

    return matchSorter(
      Object.values(fileVariables).map((variable) => {
        return {
          id: `section:${variable.name}`,
          name: variable.name,
          children: Object.values(variable.value ?? []).map((value) => ({
            id: `item:variable:${value.id}`,
            action: (editor) =>
              editor.commands.setVariable({
                type: "fileMention",
                id: value.id,
              }),
            description: `Füge die Dateivariable ${value.name} von Block ${variable.name} als Downloadlink ein.`,
            Icon: <VariableTypeIcon type={value.type} />,
            name: value.name,
          })),
        };
      }),
      variableQuery ?? "",
      {
        keys: [
          (item) => [
            item.name,
            ...Object.values(item.children ?? []).map((value) => value.name),
          ],
        ],
      },
    );
  }

  const withFilteredCommands = (groups: Group[]) =>
    groups.map((group) => ({
      ...group,
      children: group.children
        .filter((item) => {
          const labelNormalized = item.name.toLowerCase().trim();
          const queryNormalized = query.toLowerCase().trim();

          if (item.aliases) {
            const aliases = item.aliases.map((alias) =>
              alias.toLowerCase().trim(),
            );

            return (
              labelNormalized.includes(queryNormalized) ||
              aliases.includes(queryNormalized)
            );
          }

          return labelNormalized.includes(queryNormalized);
        })
        .filter((command) =>
          command.shouldBeHidden ? !command.shouldBeHidden(editor) : true,
        ),
    }));

  const withoutEmptyGroups = (group: Group[]) =>
    withFilteredCommands(group).filter((group) => {
      if (group.children.length > 0) {
        return true;
      }

      return false;
    });

  const withEnabledSettings = (group: Group[]) =>
    withoutEmptyGroups(group).map((group) => ({
      ...group,
      children: group.children.map((command) => ({
        ...command,
        isEnabled: true,
      })),
    }));

  return withEnabledSettings(groups);
}

export type MenuListProps = Omit<
  AriaListBoxProps<Group | Command>,
  "onAction" | "children"
> & {
  query: string;
  editor: Editor;
  onAction: (command: Command) => void;
  groups: Group[];
} & VariableExtensionsParams;

export const MenuList = React.forwardRef(
  (
    {
      items: _,
      onAction,
      editor,
      query,
      variables = {},
      fileVariables = {},
      richTextVariables = {},
      groups,
      ...props
    }: MenuListProps,
    ref,
  ) => {
    const filteredCommands = React.useMemo(
      () =>
        filterCommands({
          query,
          variables,
          fileVariables,
          richTextVariables,
          editor,
          groups,
        }),
      [editor, fileVariables, query, richTextVariables, variables, groups],
    );

    const state = useListState<Group | Command>({
      items: filteredCommands,
      selectionMode: "single",
      children: (item) => {
        const castedItem = item as Group;
        return (
          <Section
            key={castedItem.name}
            items={castedItem.children}
            title={castedItem.name}
          >
            {(item) => <Item>{item.name}</Item>}
          </Section>
        );
      },
      ...props,
    });

    const actionHandler = React.useCallback(
      (id: Key) => {
        const item = state.collection.getItem(id);

        if (!item || !item.value) {
          return;
        }

        if (!isCommand(item)) {
          throw new Error("Selected Item is not a command");
        }

        onAction(item.value);
      },
      [onAction, state.collection],
    );

    const listRef = React.useRef<HTMLDivElement | null>(null);
    const { listBoxProps } = useListBox(
      {
        selectionMode: "single",
        shouldFocusWrap: true,
        shouldFocusOnHover: true,
        onAction: actionHandler,
        "aria-label": "Rich Text Editor Menü",
        ...props,
      },
      state,
      listRef,
    );

    // We only want to focus the child items and not the sections.
    const keys = Array.from(state.collection).flatMap((item) =>
      item.type === "section"
        ? Array.from(state.collection.getChildren?.(item.key) ?? []).map(
            (child) => child.key,
          )
        : [item.key],
    );

    React.useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
        if (event.key === "ArrowDown") {
          const focusedKey = state.selectionManager.focusedKey;

          // The keyAfter is the next key in the list of keys. If it cannot be found
          // this means we are at the end of the list and start with the first key.
          const keyAfter =
            keys[keys.findIndex((key) => key === focusedKey) + 1] ?? keys[0];

          if (!keyAfter) return false;

          state.selectionManager.setFocusedKey(keyAfter);
          document
            .getElementById(keyAfter.toString())
            ?.scrollIntoView({ behavior: "smooth", block: "end" });

          return true;
        }

        if (event.key === "ArrowUp") {
          const focusedKey = state.selectionManager.focusedKey;

          // The keyBefore is the previous key in the list of keys. If it cannot be found
          // this means we are at the start of the list and start with the last key.
          const keyBefore =
            keys[keys.findIndex((key) => key === focusedKey) - 1] ??
            keys.at(-1) ??
            keys[0];

          if (!keyBefore) return false;

          state.selectionManager.setFocusedKey(keyBefore);
          document
            .getElementById(keyBefore.toString())
            ?.scrollIntoView({ behavior: "smooth", block: "end" });

          return true;
        }

        if (event.key === "Enter") {
          const focusedKey = state.selectionManager.focusedKey;

          if (!focusedKey) {
            const firstKey = keys[0];
            if (!firstKey) return false;

            return actionHandler(firstKey);
          }

          actionHandler(focusedKey);

          return true;
        }

        return false;
      },
    }));

    const items = [...state.collection];

    return (
      <div
        className={twMerge(
          menuContainerClasses,
          "max-h-[400px] overflow-y-auto",
        )}
      >
        <div
          className="grid grid-cols-1 gap-1 list-none"
          {...listBoxProps}
          ref={listRef}
        >
          {items.length > 0 ? (
            items.map((item) => {
              switch (true) {
                case isGroup(item):
                  return (
                    <ListBoxSection
                      key={item.key}
                      section={item}
                      state={state}
                    />
                  );

                case isCommand(item):
                  return <Option key={item.key} item={item} state={state} />;

                default:
                  throw new Error("Item is not a group or command");
              }
            })
          ) : (
            <li className="mx-2 px-3 py-1.5 min-w-[250px]">No results</li>
          )}
        </div>
      </div>
    );
  },
);

function Option({
  item,
  state,
}: {
  item: Node<Command>;
  state: ListState<Group | Command>;
}) {
  // Get props for the option element
  const ref = React.useRef(null);
  const { optionProps } = useOption({ key: item.key }, state, ref);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { focusProps } = useFocusRing();
  const hasFocus = state.selectionManager.focusedKey === item.key;

  if (!isCommand(item)) {
    throw new Error("Item is not a command");
  }

  return (
    <li
      className={menuItemClasses("my-0 hover:bg-transparent")}
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      id={item.key.toString()}
      aria-label={item.value?.description}
      {...(hasFocus ? { "data-focus-visible": true } : {})}
    >
      {item.value?.Icon}
      {item.value?.name ?? item.rendered}
    </li>
  );
}

function ListBoxSection({
  section,
  state,
}: {
  section: Node<Group>;
  state: ListState<Group | Command>;
}) {
  const { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    "aria-label": section["aria-label"],
  });

  const children = Array.from(
    state.collection.getChildren?.(section.key) ?? [],
  ) as unknown as Node<Command>[];

  // If the section is not the first, add a separator element to provide visual separation.
  // The heading is rendered inside an <li> element, which contains
  // a <ul> with the child items.
  return (
    <li
      {...itemProps}
      className="m-0 mt-2 first:mt-0 grid gap-1"
      id={section.key.toString()}
    >
      {section.rendered && (
        <span {...headingProps} className={menuLabelClasses("mb-1")}>
          {section.value?.name ?? section.rendered}
        </span>
      )}
      <ul {...groupProps} className="list-none p-0 gap-1 grid grid-cols-1">
        {children.map((node) => (
          <Option key={node.key} item={node} state={state} />
        ))}
      </ul>
    </li>
  );
}

export default MenuList;
