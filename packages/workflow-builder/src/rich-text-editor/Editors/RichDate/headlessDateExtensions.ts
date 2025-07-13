import { textClasses } from "@mioto/design-system/Text/classes";
import {
  InputRule,
  callOrReturn,
  getSchema,
  mergeAttributes,
} from "@tiptap/core";
import { Node } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { getUnixTime } from "date-fns";
import type { TNodeId } from "../../../tree/id";
import type {
  INumberVariable,
  IRecordVariable,
} from "../../../variables/exports/types";
import { HeadlessVariableExtension } from "../../extensions/Variable/HeadlessVariableExtension";
import { OneLinerMath } from "./constrainInputPlugin";

const transformToUnixDate = (date: string) => {
  const [day, month, year] = date.split(".");

  if (day && month && year) {
    const parsedDay = Number.parseInt(day, 10);
    // Month is 0-indexed in JavaScript Date
    const parsedMonth = Number.parseInt(month, 10) - 1;
    const parsedYear = Number.parseInt(year, 10);

    return getUnixTime(new Date(parsedYear, parsedMonth, parsedDay)).toString();
  }
  throw new Error("Invalid date format");
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customDate: {
      /**
       * Toggle a paragraph
       */
      addCustomDate: (date: string) => ReturnType;
    };
  }
}

export const CustomDateExtension = Node.create({
  name: "customDate",
  inline: true,
  group: "inline",
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      date: {
        default: null,
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes)];
  },
  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }];
  },
  addCommands() {
    return {
      addCustomDate:
        (date) =>
        ({ commands }) => {
          const unixDate = transformToUnixDate(date);

          return commands.insertContent([
            {
              type: "customDate",
              attrs: { date: unixDate },
            },
          ]);
        },
    };
  },
  renderText: (props) => {
    return props.node.attrs.date;
  },
  addInputRules() {
    return [
      new InputRule({
        find: /(?<!\S)\d{1,2}\.\d{1,2}\.\d{4}\b/,
        handler: ({ state, range, match }) => {
          const attributes =
            callOrReturn(
              { date: transformToUnixDate(match[0]) },
              undefined,
              match,
            ) || {};
          const { tr } = state;
          const start = range.from;
          let end = range.to;

          const newNode = this.type.create(attributes);

          if (match[1]) {
            const offset = match[0].lastIndexOf(match[1]);
            let matchStart = start + offset;

            if (matchStart > end) {
              matchStart = end;
            } else {
              end = matchStart + match[1].length;
            }

            // insert last typed character
            const lastChar = match[0][match[0].length - 1] ?? "";

            tr.insertText(lastChar, start + match[0].length - 1);

            // insert node from input rule
            tr.replaceWith(matchStart, end, newNode);
          } else if (match[0]) {
            tr.insert(start, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          }

          tr.scrollIntoView();
        },
      }),
    ];
  },
});

export const sharedRichDateEditorExtensions = [
  OneLinerMath,
  Paragraph.configure({
    HTMLAttributes: {
      class: textClasses({ size: "large" }),
    },
  }),
  Text,
];

type Params = {
  variables: Record<TNodeId, IRecordVariable<INumberVariable>>;
  locale: string;
};

export const headlessRichDateExtensions = (params: Params) => [
  ...sharedRichDateEditorExtensions,
  CustomDateExtension,
  HeadlessVariableExtension(params),
];

export const richDateEditorSchema = getSchema(
  headlessRichDateExtensions({
    variables: {},
    locale: "en-US",
  }),
);
