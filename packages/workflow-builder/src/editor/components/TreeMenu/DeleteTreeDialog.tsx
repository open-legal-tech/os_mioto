"use client";

import {
  DialogDefault,
  DialogRoot,
  type DialogRootProps,
} from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
import { deleteTreeAction } from "@mioto/server/actions/deleteTree.action";

type Props = {
  tree: { name: string; uuid: string };
  className?: string;
} & Pick<DialogRootProps, "open" | "onOpenChange">;

export function DeleteTreeDialog({ tree, open, onOpenChange }: Props) {
  const t = useTranslations();
  const methods = Form.useForm({
    defaultValues: { treeName: "" },
    resolver: (values) => {
      return values.treeName === tree.name
        ? { values, errors: {} }
        : {
            values: {},
            errors: {
              treeName: {
                message: "Der Projektname stimmt nicht überein.",
                type: "pattern",
              },
            },
          };
    },
  });

  return (
    <Form.Provider methods={methods}>
      <DialogRoot destructive open={open} onOpenChange={onOpenChange}>
        <DialogDefault
          title={t("components.deleteTreeDialog.title")}
          description={t.rich("components.deleteTreeDialog.description", {
            treeName: tree.name,
          })}
          ConfirmationButton={
            <Form.SubmitButton>
              {t("components.deleteTreeDialog.submit")}
            </Form.SubmitButton>
          }
        >
          <Form.Root
            onSubmit={methods.handleAsyncSubmit(async () => {
              await deleteTreeAction({ treeUuid: tree.uuid });

              onOpenChange?.(false);
            })}
          >
            <Form.Field
              Label={t("components.deleteTreeDialog.tree-name.label")}
            >
              <Form.Input
                {...methods.register("treeName")}
                required
                placeholder={tree.name}
              />
            </Form.Field>
          </Form.Root>
        </DialogDefault>
      </DialogRoot>
    </Form.Provider>
  );
}
