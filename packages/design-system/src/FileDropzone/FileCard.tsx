import { useTranslations } from "@mioto/locale";
import { Download, File, X } from "@phosphor-icons/react";
import React from "react";
import type { Accept } from "react-dropzone";
import { useDebounce } from "react-use";
import { FileDropzone, type TExistingFile } from ".";
import { cardClasses } from "../Card/Card";
import { Heading as SystemHeading } from "../Heading";
import { IconButton, IconButtonLink } from "../IconButton";
import Input from "../Input";
import Label from "../Label";
import { LoadingSpinner } from "../LoadingSpinner";
import { Row, rowClasses } from "../Row";
import { Stack } from "../Stack/Stack";
import Text from "../Text";

export function FileCard({
  Heading,
  existingFile,
  onDelete,
  onUpload,
  title,
  placeholder,
  onUrlChange,
  url,
  accept,
}: {
  Heading: React.ReactNode;
  existingFile?: TExistingFile;
  onDelete: () => Promise<void> | void;
  onUpload: (formData: FormData) => Promise<void> | void;
  title: string;
  placeholder?: string;
  onUrlChange: (newUrl: string) => void | Promise<void>;
  url?: string | null;
  accept?: Accept;
}) {
  const [isLoading, startTransition] = React.useTransition();
  const [isUpdatingUrl, startUrlUpdateTransitions] = React.useTransition();
  const [newUrl, setNewUrl] = React.useState(url ?? null);
  const t = useTranslations();

  useDebounce(
    () =>
      startUrlUpdateTransitions(() => {
        if (!newUrl) return;
        onUrlChange(newUrl);
      }),
    200,
    [newUrl],
  );

  const id = React.useId();

  return (
    <Stack className={cardClasses("gap-3")}>
      <Row className="justify-between">
        <SystemHeading
          size="extra-small"
          className={rowClasses({}, "items-center gap-1")}
        >
          {Heading}
        </SystemHeading>
        {existingFile ? (
          <Row>
            {existingFile.uuid ? (
              <IconButtonLink
                href={`/api/getFile/${existingFile.uuid}`}
                download={existingFile.name}
                tooltip={{
                  children: t(
                    "components.file-dropzone.existing-file.download.tooltip",
                    { title },
                  ),
                }}
                size="small"
              >
                <Download />
              </IconButtonLink>
            ) : null}
            <IconButton
              isLoading={isLoading}
              size="small"
              tooltip={{
                children: t(
                  "components.file-dropzone.existing-file.remove.tooltip",
                  { title },
                ),
              }}
              onClick={() =>
                startTransition(() => {
                  setNewUrl("");
                  onDelete();
                })
              }
            >
              <X />
            </IconButton>
          </Row>
        ) : null}
      </Row>
      {existingFile?.uuid ? (
        <Row className="items-center gap-2">
          <File />
          <Text>{existingFile.name}</Text>
        </Row>
      ) : (
        <Stack className="gap-2">
          <Stack className="gap-1">
            <Label htmlFor={id} size="small">
              {t("app.settings.file-card.url.label")}
            </Label>
            <Input
              value={newUrl ?? ""}
              id={id}
              className="flex-1 bg-white"
              placeholder={placeholder}
              onChange={(event) => setNewUrl(event.target.value)}
              Button={isUpdatingUrl ? <LoadingSpinner /> : undefined}
            />
          </Stack>
          {newUrl ? null : (
            <FileDropzone
              isLoading={isLoading}
              onValidFileDrop={(acceptedFiles) =>
                startTransition(async () => {
                  const file = acceptedFiles[0];

                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  onUpload(formData);
                })
              }
              Label={
                <Text
                  className="font-weak"
                  aria-label={t(
                    "app.settings.file-card.empty-dropzone.aria-label",
                    { title },
                  )}
                >
                  {t("app.settings.file-card.empty-dropzone.label")}
                </Text>
              }
              accept={accept}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
}
