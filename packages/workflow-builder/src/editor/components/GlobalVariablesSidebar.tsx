import Badge from "@mioto/design-system/Badge";
import { cardClasses } from "@mioto/design-system/Card";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { IconButton } from "@mioto/design-system/IconButton";
import { Notification } from "@mioto/design-system/Notification";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Word from "@mioto/icons/Word";
import { useTranslations } from "@mioto/locale";
import { Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { match } from "ts-pattern";
import {
  type GlobalVariable,
  GlobalVariablesNode,
  type TGlobalVariableId,
} from "../../plugins/node/global-variables/plugin";
import { variableIcons } from "../../variables/VariableIcons";
import { createReadableKey } from "../../variables/exports/createReadableKey";
import { useTree, useTreeClient } from "../exports/state";

export function GlobalVariablesSidebar() {
  const { treeClient } = useTreeClient();
  const globalVariables = useTree((treeClient) => {
    return GlobalVariablesNode.has(GlobalVariablesNode.id)(treeClient)
      ? GlobalVariablesNode.getSingle(GlobalVariablesNode.id)(treeClient)
          .variables
      : undefined;
  });

  const t = useTranslations();

  return (
    <>
      <Row className="justify-between items-center">
        <Heading>{t("app.editor.global-variables.title")}</Heading>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <DropdownMenu.Button>
              <Plus />
              {t("app.editor.global-variables.add-button.label")}
            </DropdownMenu.Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              onSelect={() =>
                GlobalVariablesNode.addVariable({
                  type: "text",
                })(treeClient)
              }
            >
              {t("common.variableNames.text")}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() =>
                GlobalVariablesNode.addVariable({
                  type: "number",
                })(treeClient)
              }
            >
              {t("common.variableNames.number")}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Row>
      {globalVariables ? (
        <Stack className="gap-2 mt-4">
          {Object.values(globalVariables).map(({ id, ...props }) => (
            <GlobalVariableCard {...props} key={id} id={id} />
          ))}
        </Stack>
      ) : null}
    </>
  );
}

function GlobalVariableCard({
  name,
  type,
  references: _,
  id,
  defaultValue,
}: {
  name: string;
  type: GlobalVariable["type"];
  references: string[];
  id: TGlobalVariableId;
  defaultValue?: GlobalVariable["defaultValue"];
}) {
  const t = useTranslations();
  const { treeClient } = useTreeClient();

  const methods = Form.useForm({
    defaultValues: {
      name,
      type,
      defaultValue,
    },
  });

  const globalVariable = GlobalVariablesNode.createVariable({
    nodeId: GlobalVariablesNode.id,
  })(treeClient);
  const readableKey = `{${createReadableKey([
    globalVariable.variable.escapedName,
    name,
  ])}}`;

  return (
    <Stack className={cardClasses("p-0 [--padding:var(--space4)]")}>
      <Row className="items-center justify-between p-[--padding]">
        <Heading size="extra-small">
          {name.length > 0 ? (
            name
          ) : (
            <i>{t("app.editor.global-variables.card.no-name")}</i>
          )}
        </Heading>
        <Row className="items-center gap-2">
          <Badge colorScheme="gray">
            {t(`common.variableNames.${type}`)}
            {variableIcons[type]}
          </Badge>
          <IconButton
            tooltip={{
              children: t("app.editor.global-variables.card.remove.tooltip"),
            }}
            onClick={() => {
              GlobalVariablesNode.removeVariable(id)(treeClient);
            }}
          >
            <Trash />
          </IconButton>
          <IconButton
            tooltip={{
              children: t(
                "app.editor.global-variables.card.copy-variable-key.tooltip",
              ),
            }}
            onClick={() => {
              navigator.clipboard.writeText(readableKey);
              Notification.add({
                Title: t(
                  "app.editor.global-variables.card.copy-variable-key.notification.copy.title",
                ),
                Content: () => (
                  <Stack>
                    {t.rich(
                      "app.editor.global-variables.card.copy-variable-key.notification.copy.content",
                      {
                        key: () => (
                          <span className="overflow-auto border border-gray5 bg-gray1 rounded p-3 whitespace-nowrap text-smallText">
                            {readableKey}
                          </span>
                        ),
                      },
                    )}
                  </Stack>
                ),
                variant: "success",
              });
            }}
          >
            <Word />
          </IconButton>
        </Row>
      </Row>
      <Form.Provider methods={methods}>
        <Form.Root className="flex-1 bg-gray1 p-[--padding] border-t border-gray2">
          <Form.Field Label={t("app.editor.global-variables.card.name.label")}>
            <Form.Input
              {...methods.register("name", {
                onChange: (event) =>
                  GlobalVariablesNode.updateVariableName(
                    id,
                    event.target.value,
                  )(treeClient),
              })}
            />
          </Form.Field>
          <Form.Field Label="Initialer Wert">
            {match(type)
              .with("number", () => (
                <Form.Input
                  type="number"
                  {...methods.register("defaultValue", {
                    onChange: (event) =>
                      GlobalVariablesNode.updateDefaultValue(
                        id,
                        event.target.valueAsNumber,
                      )(treeClient),
                  })}
                />
              ))
              .with("text", () => (
                <Form.Input
                  {...methods.register("defaultValue", {
                    onChange: (event) =>
                      GlobalVariablesNode.updateDefaultValue(
                        id,
                        event.target.value,
                      )(treeClient),
                  })}
                />
              ))
              .exhaustive()}
          </Form.Field>
        </Form.Root>
      </Form.Provider>
    </Stack>
  );
}
