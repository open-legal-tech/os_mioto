import type { TranslationFn } from "@mioto/locale";
import { At } from "@phosphor-icons/react/dist/ssr";
import type { Group } from "../../extensions/SlashCommand/types";

export const richInputGroups = (t: TranslationFn): Group[] => [
  {
    id: `section:variables`,
    name: "Variablen",
    children: [
      {
        id: `item:variable`,
        name: t("components.rich-text-editor.slashCommand.addVariable.title"),
        Icon: <At />,
        description: t(
          "components.rich-text-editor.slashCommand.addVariable.description",
        ),
        aliases: ["var"],
        action: (editor) => {
          editor
            ?.chain()
            .focus()
            .insertContent([{ type: "text", text: "/@" }])
            .run();
        },
      },
    ],
  },
];
