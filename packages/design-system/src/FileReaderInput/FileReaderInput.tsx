import * as React from "react";
import { FileInput, type FileInputProps } from "../FileInput/FileInput";

export type FileInputMetadata = {
  fileName: string;
  type: string;
  extension: string;
};

type Props = {
  onFileLoad: (
    event: ProgressEvent<FileReader>,
    metadata: FileInputMetadata,
  ) => void;
} & FileInputProps;

export const FileReaderInput = React.forwardRef<HTMLInputElement, Props>(
  function FileReaderInput({ onFileLoad, children, ...props }, ref) {
    return (
      <FileInput
        ref={ref}
        onChange={(event) => {
          if (!(event.target instanceof HTMLInputElement)) return;
          const fileReader = new FileReader();

          const file = event.currentTarget.files?.[0];
          const fileExtension = file?.name.split(".").pop();

          if (!file || !fileExtension) return;

          fileReader.onload = (event) => {
            onFileLoad(event, {
              fileName: file.name,
              type: file.type,
              extension: fileExtension,
            });
          };

          if (!event.currentTarget.files?.[0]) return;
          fileReader.readAsText(event.currentTarget.files[0]);
          event.target.value = "";
        }}
        {...props}
      >
        {children}
      </FileInput>
    );
  },
);
