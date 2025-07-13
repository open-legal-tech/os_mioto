"use client";

import { useTranslations } from "@mioto/locale";
import { CloudArrowUp, X } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import {
  type DropzoneOptions,
  type FileRejection,
  useDropzone,
} from "react-dropzone";
import { Button } from "../Button";
import { type LabelProps, labelClasses } from "../Label";
import { LoadingSpinner } from "../LoadingSpinner";
import { Notification } from "../Notification";
import { Row, rowClasses } from "../Row";
import { stackClasses } from "../Stack";

export type TExistingFile = {
  name?: string;
  uuid?: string;
  url?: string | null;
};

export function FileDropzone({
  className,
  value,
  onValidFileDrop,
  onReset,
  isLoading,
  Label,
  accept,
  ExistingFile,
  labelSize,
  labelClassName,
  maxSize,
  ...params
}: {
  className?: string;
  value?: File[];
  onValidFileDrop: (acceptedFiles: File[]) => void;
  onReset?: () => void;
  isLoading?: boolean;
  Label: React.ReactNode;
  ExistingFile?: React.ReactNode;
  labelSize?: LabelProps["size"];
  labelClassName?: string;
} & Omit<DropzoneOptions, "onDrop">) {
  const t = useTranslations();
  const onDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length === 0) {
        fileRejections.forEach((rejection) => {
          rejection.errors.forEach((error) => {
            if (error.code === "file-too-large") {
              Notification.add({
                Title: t(
                  "plugins.node.document.template-card.notification.size_too_large.title",
                ),
                Content: t(
                  "plugins.node.document.template-card.notification.size_too_large.content",
                ),
                variant: "warning",
              });
            }
            if (error.code === "file-invalid-type") {
              Notification.add({
                Title: t(
                  "plugins.node.document.template-card.notification.invalid_file_type.title",
                ),
                Content: t(
                  "plugins.node.document.template-card.notification.invalid_file_type.content",
                ),
                variant: "warning",
              });
            }
          });
        });
        return;
      }
      onValidFileDrop(acceptedFiles);
    },
    [onValidFileDrop, t],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      noClick: true,
      maxSize,
      ...params,
    });

  if (ExistingFile) return <div className={className}>{ExistingFile}</div>;

  if (isLoading)
    return (
      <div className={`${className} justify-center items-center flex h-[31px]`}>
        <LoadingSpinner />
      </div>
    );

  const baseClasses =
    "gap-2 focus:outer-focus rounded items-center justify-center border border-gray6 border-dashed p-4";

  if (value && value?.length > 0) {
    return (
      <Row className={baseClasses}>
        <span>{value.map((file) => file.name).join("\n")}</span>
        <Button
          size="small"
          variant="tertiary"
          onClick={() => {
            onReset?.();
          }}
        >
          <X />
        </Button>
      </Row>
    );
  }

  return (
    <label
      {...getRootProps({
        className: stackClasses({}, [
          baseClasses,
          `transition-colors cursor-pointer`,
          className,
          isDragActive && "colorScheme-success",
          isDragReject && "colorScheme-danger",
        ]),
      })}
    >
      <Row className="gap-2 items-center">
        {isDragReject ? (
          <span>Ungültige Datei</span>
        ) : isDragActive ? (
          <span>Hochladen</span>
        ) : (
          <>
            <span
              className={rowClasses({}, [
                "gap-1",
                labelClasses({ size: labelSize, className: labelClassName }),
                isDragReject || isDragActive ? "opacity-0" : "",
              ])}
            >
              {Label}
            </span>
            <input {...getInputProps()} />
            <CloudArrowUp />
          </>
        )}
      </Row>
    </label>
  );
}
