import type { Icon } from "@phosphor-icons/react";
import { AINodeIcon } from "../plugins/node/ai/exports/editor";
import { AuthenticationNodeIcon } from "../plugins/node/authentication/exports/editor";
import { CalculationNodeIcon } from "../plugins/node/calculation/editor";
import { DocumentNodeIcon } from "../plugins/node/documentv2/editor";
import { FormNodeIcon } from "../plugins/node/form/exports/editor";
import { GlobalVariablesNodeIcon } from "../plugins/node/global-variables/editor";
import { InfoNodeIcon } from "../plugins/node/info/exports/editor";
import { LogicNodeIcon } from "../plugins/node/logic/editor";
import { ReportingNodeIcon } from "../plugins/node/reporting/editor";
import { TextInterpolationNodeIcon } from "../plugins/node/text-interpolation/editor";
import type { TTreeClientWithPlugins } from "../tree/createTreeClientWithPlugins";

export const editorIcons = {
  form: FormNodeIcon,
  info: InfoNodeIcon,
  documentv2: DocumentNodeIcon,
  document: DocumentNodeIcon,
  reporting: ReportingNodeIcon,
  logic: LogicNodeIcon,
  calculation: CalculationNodeIcon,
  "text-interpolation": TextInterpolationNodeIcon,
  authentication: AuthenticationNodeIcon,
  ai: AINodeIcon,
  "system-globalVariables": GlobalVariablesNodeIcon,
  decision: FormNodeIcon,
  placeholder: FormNodeIcon,
} satisfies Record<keyof TTreeClientWithPlugins["nodePlugins"], Icon> as Record<
  keyof TTreeClientWithPlugins["nodePlugins"],
  Icon
> & { [x: string]: Icon };
