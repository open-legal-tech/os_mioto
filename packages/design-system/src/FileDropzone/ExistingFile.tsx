import { useTranslations } from "@mioto/locale";
import { Download, File, X } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import Heading from "../Heading";
import { IconButton } from "../IconButton/IconButton";
import { IconButtonLink } from "../IconButton/IconButtonLink";
import { Row } from "../Row/Row";
import { Stack } from "../Stack/Stack";
import Text from "../Text";
import type { TExistingFile } from "./FileDropzone";

export function ExistingFile({
  title,
  existingFile,
  onDelete,
}: {
  existingFile: TExistingFile;
  title: string;
  onDelete: () => Promise<any>;
}) {
  const [isLoading, startTransition] = React.useTransition();
  const t = useTranslations();

  return (
    <Stack className="gap-2 flex-1">
      <Row className="items-center justify-between gap-2">
        <Heading size="extra-small" className="relative">
          {title}
        </Heading>
        <Row className="gap-1">
          <IconButtonLink
            size="small"
            tooltip={{
              children: t(
                "components.file-dropzone.existing-file.download.tooltip",
                { title },
              ),
            }}
            href={`/api/getFile/${existingFile.uuid}`}
            download={existingFile.name}
          >
            <Download />
          </IconButtonLink>
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
                onDelete();
              })
            }
          >
            <X />
          </IconButton>
        </Row>
      </Row>
      <Row className="items-center gap-2">
        <File />
        <Text>{existingFile.name}</Text>
      </Row>
    </Stack>
  );
}
