import { cardClasses } from "@mioto/design-system/Card";
import { FileDropzone } from "@mioto/design-system/FileDropzone";
import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { IconButton } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { FileText, Stack, X } from "@phosphor-icons/react";
import { captureException } from "@sentry/nextjs";
import type { Editor } from "@tiptap/core";
import React from "react";
import { onFileUploadAction } from "../../Editors/RichTextEditor/onFileUpload.action";

export function AddImage({ editor }: { editor: Editor }) {
  const methods = Form.useForm<{
    src: string;
    alt: string;
  }>();

  const t = useTranslations();
  const [file, setFile] = React.useState<File | null>(null);
  const hasUrl = methods.watch("src")?.length > 0;

  return (
    <Form.Provider methods={methods}>
      <Form.Root
        onSubmit={methods.handleAsyncSubmit(async (values) => {
          try {
            let url: string;
            if (file) {
              const formData = new FormData();
              formData.append("file", file);

              const result = await onFileUploadAction(formData);

              if (!result.success) {
                throw new Error(result.error.debugMessage);
              }

              url = result.data.url;
              methods.setValue("src", url);
            } else {
              url = values.src;
            }

            editor
              ?.chain()
              .setImageBlock({ src: url, alt: values.alt })
              .focus()
              .run();

            setFile(null);
            methods.reset();
          } catch (e) {
            captureException(e);
            methods.setError("src", {
              message: t(
                "components.rich-text-editor.add-image.url.error.invalid-url",
              ),
              type: "pattern",
            });
          }
        })}
        className="px-2"
      >
        <Row className="justify-between">
          <Heading size="extra-small">
            {t("components.rich-text-editor.add-image.title")}
          </Heading>
          <HelpTooltip className="max-w-[500px]">
            <Stack className="gap-4 p-4 px-2">
              <Stack className="gap-1">
                <Heading size="small" className="text-white">
                  {t(
                    "components.rich-text-editor.add-image.help-tooltip.intro.heading",
                  )}
                </Heading>
                <Text className="text-white">
                  {t(
                    "components.rich-text-editor.add-image.help-tooltip.intro.content",
                  )}
                </Text>
              </Stack>
              <Stack className="gap-1">
                <Heading level={3} size="extra-small" className="text-white">
                  {t(
                    "components.rich-text-editor.add-image.help-tooltip.url.heading",
                  )}
                </Heading>
                <Text className="text-white">
                  {t(
                    "components.rich-text-editor.add-image.help-tooltip.url.content",
                  )}
                </Text>
              </Stack>
              <Stack className="gap-1">
                <Heading level={3} size="extra-small" className="text-white">
                  {t(
                    "components.rich-text-editor.add-image.help-tooltip.upload.heading",
                  )}
                </Heading>
                <Text className="text-white">
                  {t(
                    "components.rich-text-editor.add-image.help-tooltip.upload.content",
                  )}
                </Text>
              </Stack>
            </Stack>
          </HelpTooltip>
        </Row>
        {file ? null : (
          <Form.Field
            labelSize="small"
            size="small"
            Label={t("components.rich-text-editor.add-image.url.label")}
          >
            <Form.Input
              className="min-w-[200px]"
              size="small"
              autoFocus
              placeholder={t(
                "components.rich-text-editor.add-image.url.placeholder",
              )}
              {...methods.register("src", {
                required: {
                  value: !file,
                  message: t(
                    "components.rich-text-editor.add-image.url.error.required",
                  ),
                },
              })}
            />
          </Form.Field>
        )}
        {hasUrl ? null : (
          <FileDropzone
            labelSize="small"
            labelClassName="min-h-[22px]"
            Label={t(
              "components.rich-text-editor.add-image.drag-and-drop.empty-label",
            )}
            onValidFileDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];

              if (!file) return;

              setFile(file);
            }}
            className={cardClasses("justify-center flex")}
            ExistingFile={
              file ? (
                <Text
                  className="flex-grow-0 flex items-center gap-1"
                  size="small"
                >
                  <FileText />
                  <span>{file?.name}</span>
                  <IconButton
                    size="small"
                    tooltip={{
                      children: t(
                        "components.rich-text-editor.add-image.drag-and-drop.clear-input",
                      ),
                    }}
                    onClick={() => {
                      setFile(null);
                    }}
                  >
                    <X />
                  </IconButton>
                </Text>
              ) : null
            }
          />
        )}
        <Form.Field
          labelSize="small"
          size="small"
          Label={t("components.rich-text-editor.add-image.alt-text.label")}
        >
          <Form.Input
            placeholder={t(
              "components.rich-text-editor.add-image.alt-text.placeholder",
            )}
            className="min-w-[200px]"
            size="small"
            {...methods.register("alt", {
              required: {
                value: true,
                message: t(
                  "components.rich-text-editor.add-image.alt-text.error.required",
                ),
              },
            })}
          />
        </Form.Field>
        <Form.SubmitButton size="small" className="mt-1">
          {t("components.rich-text-editor.add-image.submit")}
        </Form.SubmitButton>
      </Form.Root>
    </Form.Provider>
  );
}
