import { FileDropzone } from "@mioto/design-system/FileDropzone";
import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import React from "react";
import { onFileUploadAction } from "./onFileUpload.action";

export const ImageUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const [isLoading, startTransition] = React.useTransition();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <FileDropzone
      className="bg-white"
      Label="Drag and drop an image here or click to upload"
      accept={{
        "image/jpeg": [],
        "image/png": [],
      }}
      onValidFileDrop={(files) => {
        startTransition(async () => {
          const file = files[0];

          if (!file) return;

          const formData = new FormData();

          formData.append("file", file);

          const result = await onFileUploadAction(formData);

          if (!result.success) {
            throw new Error(result.error.debugMessage);
          }

          onUpload(result.data.url);
        });
      }}
    />
  );
};

export default ImageUploader;
