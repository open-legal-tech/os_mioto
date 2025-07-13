import {
  DialogButtonRow,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@mioto/design-system/Dialog";
import { FileDropzone } from "@mioto/design-system/FileDropzone";
import { Form } from "@mioto/design-system/Form";
import Link from "@mioto/design-system/Link";
import { messageClasses } from "@mioto/design-system/Message";
import { Notification } from "@mioto/design-system/Notification";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { FileCss, PaintRoller, Plus } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { customCss, themeTemplate } from "./templates";
import { themeUploadAction } from "./themeUpload.action";

export type Theme = { name: string; id: string };

export function ThemeDialog({
  children,
  selectedTheme,
  onClose,
}: {
  children?: React.ReactNode;
  selectedTheme?: Theme;
  onClose?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [themeFiles, setThemeFiles] = React.useState<File[] | undefined>();
  const [fileError, setFileError] = React.useState<string | null>(null);

  const [customCssFiles, setCustomCssFiles] = React.useState<
    File[] | undefined
  >();

  const t = useTranslations();

  const themeDownloadLink = URL.createObjectURL(
    new Blob([JSON.stringify(themeTemplate)], { type: "application/json" }),
  );

  const customCssDownloadLink = URL.createObjectURL(
    new Blob([customCss], { type: "application/css" }),
  );

  const methods = Form.useForm<{ name: string }>();

  return (
    <DialogRoot
      open={open || selectedTheme != null}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.() ?? methods.setValue("name", "");
          setThemeFiles(undefined);
          setFileError(null);
        }
        setOpen(open);
      }}
    >
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("app.settings.theme-management.file-upload.heading")}
          </DialogTitle>
        </DialogHeader>
        <Form.Provider methods={methods}>
          <Form.Root
            className="flex flex-col gap-4"
            onSubmit={methods.handleAsyncSubmit(async () => {
              const file = themeFiles?.[0];
              const customCss = customCssFiles?.[0];

              if (!file) {
                setFileError(
                  t(
                    "app.settings.theme-management.file-upload.form.file-upload.required.error",
                  ),
                );
                return;
              }

              const formData = new FormData();

              formData.append("name", methods.getValues("name"));
              formData.append("theme", file);

              if (customCss) {
                formData.append("customCss", customCss);
              }

              const result = await themeUploadAction(formData);

              if (!result.success) {
                setFileError(
                  t(
                    "app.settings.theme-management.file-upload.form.file-upload.invalid.error",
                  ),
                );
                return;
              }

              Notification.add({
                Title: t(
                  "app.settings.theme-management.file-upload.form.file-upload.success.title",
                ),
                Content: t(
                  "app.settings.theme-management.file-upload.form.file-upload.success.content",
                ),
                variant: "success",
              });

              setThemeFiles(undefined);
              setCustomCssFiles(undefined);

              if (onClose) {
                onClose();
              } else {
                methods.setValue("name", "");
                setOpen(false);
              }
            })}
          >
            <Form.Field
              Label={t(
                "app.settings.theme-management.file-upload.form.name.label",
              )}
            >
              <Form.Input
                autoFocus
                {...methods.register("name")}
                placeholder="Marketingtheme"
              />
            </Form.Field>
            <Stack className="gap-2">
              <Link
                download="theme.json"
                href={themeDownloadLink}
                className="self-start"
              >
                <PaintRoller />
                {t(
                  "app.settings.theme-management.file-upload.theme-template.link",
                )}
              </Link>
              <Stack className="gap-1">
                <FileDropzone
                  onReset={() => setThemeFiles(undefined)}
                  accept={{ "application/json": [".json"] }}
                  value={themeFiles}
                  onValidFileDrop={(acceptedFiles) => {
                    setThemeFiles(acceptedFiles);
                    setFileError(null);
                  }}
                  Label={
                    <Row className="gap-1 items-center">
                      <Plus />
                      <Text className="font-weak">
                        {t(
                          "app.settings.theme-management.file-upload.form.file-upload.label",
                        )}
                      </Text>
                    </Row>
                  }
                />
                {fileError ? (
                  <span
                    className={messageClasses({
                      colorScheme: "danger",
                      size: "small",
                    })}
                  >
                    {fileError}
                  </span>
                ) : null}
              </Stack>
            </Stack>
            <Stack className="gap-2">
              <Link
                download="custom.css"
                href={customCssDownloadLink}
                className="self-start"
              >
                <FileCss />
                {t(
                  "app.settings.theme-management.file-upload.css-template.link",
                )}
              </Link>
              <FileDropzone
                onReset={() => setCustomCssFiles(undefined)}
                accept={{ "application/css": [".css"] }}
                value={customCssFiles}
                onValidFileDrop={(acceptedFiles) => {
                  setCustomCssFiles(acceptedFiles);
                }}
                Label={
                  <Row className="gap-1 items-center">
                    <Plus />
                    <Text className="font-weak">
                      {t(
                        "app.settings.theme-management.custom-css-upload.label",
                      )}
                    </Text>
                  </Row>
                }
              />
            </Stack>
            <DialogButtonRow asChild>
              <Form.SubmitButton>
                {t("app.settings.theme-management.file-upload.form.submit")}
              </Form.SubmitButton>
            </DialogButtonRow>
          </Form.Root>
        </Form.Provider>
      </DialogContent>
    </DialogRoot>
  );
}
