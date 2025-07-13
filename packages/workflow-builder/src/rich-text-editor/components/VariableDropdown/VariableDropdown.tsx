import {
  Composite,
  CompositeGroup,
  CompositeGroupLabel,
  CompositeItem,
  useCompositeStore,
} from "@ariakit/react/composite";
import { Stack } from "@mioto/design-system/Stack";
import {
  menuContainerClasses,
  menuGroupClasses,
  menuGroupItemClasses,
  menuItemClasses,
  menuLabelClasses,
} from "@mioto/design-system/classes/menuClasses";
import React, { type RefAttributes, useImperativeHandle } from "react";
import type { VariableItems } from "./createVariableDropdownSuggestion";
import "./VariableDropdown.css";
import { Row } from "@mioto/design-system/Row";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import type { Editor } from "@tiptap/react";
import {
  NodeTypeIcon,
  VariableTypeIcon,
} from "../../../editor/components/NodeTypeIcon";
import { useTree } from "../../../tree/sync/state";

export type VariableDropdownRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export type VariableDropdownProps = {
  items: VariableItems;
  command: any;
  close: () => void;
  editor: Editor;
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
  labelledBy?: string;
} & RefAttributes<VariableDropdownRef>;

export const VariableDropdown = React.forwardRef<
  VariableDropdownRef,
  VariableDropdownProps
>(({ items, command, editor, close, labelledBy }, ref) => {
  const composite = useCompositeStore({
    defaultActiveId: items[0]?.id,
    focusLoop: true,
  });

  const onSelect = () => {
    const activeId = composite.getState().activeId;

    if (activeId) {
      command({ id: activeId });
    }
  };

  const upHandler = () => {
    composite.move(composite.previous());
  };

  const downHandler = () => {
    composite.move(composite.next());
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        onSelect();
        return true;
      }

      if (event.key === "Tab") {
        composite.move(composite.getState().activeId ?? composite.next());
        return true;
      }

      return false;
    },
  }));

  return (
    <Composite
      aria-labelledby={labelledBy}
      aria-label="Variablenauswahl"
      store={composite}
      className={twMerge(
        menuContainerClasses,
        "overflow-y-auto max-h-[320px] nokey",
      )}
      role="listbox"
      onKeyDown={(event) => {
        if (event.key === "Tab" && event.shiftKey) {
          editor.commands.focus();
          event.preventDefault();
        }

        if (event.key === "Escape") {
          close();
          editor.commands.focus();
          event.preventDefault();
        }
      }}
    >
      {items.length ? (
        items.map((item, index) => {
          return (
            <Group
              key={item.id}
              item={item}
              index={index}
              onSelect={onSelect}
            />
          );
        })
      ) : (
        <div className={menuItemClasses()}>No result</div>
      )}
    </Composite>
  );
});

type GroupProps = {
  item: VariableItems[0];
  index: number;
  onSelect: () => void;
};

const Group = ({ item, index, onSelect }: GroupProps) => {
  const node = useTree((treeClient) => treeClient.nodes.get.single(item.id));

  return (
    <CompositeGroup
      role="group"
      className={index > 0 ? `${menuGroupClasses} pb-0` : ""}
      aria-labelledby={item.id}
    >
      <CompositeGroupLabel
        id={item.id}
        className={`${menuLabelClasses()} mb-2`}
      >
        <Row className="gap-2 items-center flex-1">
          <NodeTypeIcon type={node.type} />
          {item.name}
        </Row>
      </CompositeGroupLabel>
      <Stack>
        {Object.values(item.value).map((variable) => (
          <CompositeItem
            role="option"
            className={`${menuGroupItemClasses()} font-none`}
            key={item.id}
            id={item.id}
            onClick={onSelect}
          >
            <VariableTypeIcon type={variable.type} />
            {item.name}
          </CompositeItem>
        ))}
      </Stack>
    </CompositeGroup>
  );
};
