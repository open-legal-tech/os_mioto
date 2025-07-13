import type { Editor } from "@tiptap/core";

export interface Group {
  id: `section:${string}`;
  name: string;
  children: Command[];
}

export interface Command {
  id: `item:${string}`;
  name: string;
  description: string;
  aliases?: string[];
  action: (editor: Editor) => void;
  shouldBeHidden?: (editor: Editor) => boolean;
  Icon: React.ReactNode;
}

export interface MenuListProps {
  editor: Editor;
  items: Group[];
  command: (command: Command) => void;
}
