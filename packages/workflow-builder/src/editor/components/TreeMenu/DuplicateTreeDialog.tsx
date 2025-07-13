"use client";

import {
  DialogDefault,
  DialogRoot,
  type DialogRootProps,
} from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { useTranslations } from "@mioto/locale";
// import { duplicateTreeAction } from "@mioto/server/actions/duplicateTree.action";
import { updateTreeAction } from "@mioto/server/actions/updateTree.action";
import { TreeNameInput } from "../../exports/TreeNameInput";

type Props = {
  treeId: string;
  treeName: string;
  description: string | null;
} & Pick<DialogRootProps, "open" | "onOpenChange">;

export function DuplicateTreeDialog({
  treeName,
  description,
  treeId,
  open,
  onOpenChange,
}: Props) {
  const t = useTranslations();
  const methods = Form.useForm({
    defaultValues: { treeName, description },
  });

  return (
    <Form.Provider methods={methods}>
      <DialogRoot open={open} onOpenChange={onOpenChange}>
        <DialogDefault
          title="Set name"
          ConfirmationButton={
            <Form.SubmitButton>
              {t("components.updateTreeDialog.submit")}
            </Form.SubmitButton>
          }
        >
          <Form.Root
            onSubmit={methods.handleAsyncSubmit(async (values) => {
              await updateTreeAction({
                //TESTING WITH UPDATETREEACTION FOR NOW, CHANGE LATER TO DUPLICATE
                name: values.treeName,
                description: values.description,
                treeUuid: treeId,
              });

              onOpenChange?.(false);
            })}
          >
            <TreeNameInput />
            <Form.Field
              Label={t("components.updateTreeDialog.form.description.label")}
            >
              <Form.Textarea
                {...methods.register("description")}
                className="w-full"
                rows={5}
              />
            </Form.Field>
          </Form.Root>
        </DialogDefault>
      </DialogRoot>
    </Form.Provider>
  );
}
