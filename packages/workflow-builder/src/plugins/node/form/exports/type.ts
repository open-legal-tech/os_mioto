import { z } from "zod";
import { ZRichText } from "../../../../rich-text-editor/exports/types";
import { ZNodePlugin } from "../../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../../tree/type/treeClient";
import { ZDateInput } from "../inputs/plugins/date/type";
import { ZFileInput } from "../inputs/plugins/file/type";
import { ZFormattedTextAreaInput } from "../inputs/plugins/formattedTextarea/type";
import { ZMultiSelectInput } from "../inputs/plugins/multi-select/type";
import { ZNumberInput } from "../inputs/plugins/number/type";
import { ZSelectInput } from "../inputs/plugins/select/type";
import { ZTextInput } from "../inputs/plugins/text/type";
import { ZTextAreaInput } from "../inputs/plugins/textarea/type";
import { FormNode } from "./plugin";
import { ZEmailInput } from "../inputs/plugins/email/type";

const ZInputType = z.array(
  z.discriminatedUnion("type", [
    ZSelectInput,
    ZFileInput,
    ZMultiSelectInput,
    ZTextInput,
    ZTextAreaInput,
    ZNumberInput,
    ZDateInput,
    ZFormattedTextAreaInput,
    ZEmailInput,
  ]),
);

export const ZFormNode = (treeClient: TTreeClient) =>
  ZNodePlugin(FormNode.type)(treeClient).extend({
    inputs: ZInputType,
    yContent: ZRichText,
  });
