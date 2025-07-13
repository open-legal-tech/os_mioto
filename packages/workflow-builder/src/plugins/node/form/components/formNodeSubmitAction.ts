"use server";

import { File } from "node:buffer";
import { Failure } from "@mioto/errors";
import { createFile } from "@mioto/server/File/create";
import { getFileType } from "@mioto/server/File/verifyFileType";
import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";

export type ExistingFileValues = Record<
  string,
  { uuid: string; fileName: string }
>;

export async function formNodeSubmit(
  {
    sessionUuid,
    existingFileValues,
    userUuid,
  }: {
    sessionUuid: string;
    existingFileValues: ExistingFileValues;
    userUuid: string;
  },
  data: FormData,
) {
  const { user, db } = await checkAuthWithAnonymus(userUuid);

  const formDataArray = Array.from(data.entries());

  const values = await Promise.all(
    formDataArray.map(async ([key, value]) => {
      if (value instanceof File) {
        const fileData = await value.arrayBuffer();

        const fileType = await getFileType(fileData);

        if (fileType instanceof Failure) throw fileType;

        const existingFile = existingFileValues[key];

        const file = await createFile(db)({
          displayName: value.name,
          extension: fileType.ext,
          fileType: fileType.mime,
          uuid: existingFile ? existingFile.uuid : undefined,
          orgUuid: user.organizationUuid,
          fileData,
        });

        if (file instanceof Failure) throw file;

        if (!existingFile) {
          await db.userUpload.create({
            data: {
              fileUuid: file.uuid,
              sessionUuid,
              userUuid: user.uuid,
            },
          });
        }

        return {
          key,
          value: {
            uuid: file.uuid,
            fileName: value.name,
            fileType: fileType.ext,
          },
        };
      }

      return { key, value: value === "undefined" ? undefined : value };
    }),
  );

  return values.reduce(
    (acc, { key, value }) => {
      if (acc[key]) {
        const existingValue = acc[key];

        if (Array.isArray(acc[key])) {
          acc[key].push(value);
        } else {
          acc[key] = [existingValue, value];
        }

        return acc;
      }

      acc[key] = value;

      return acc;
    },
    {} as Record<string, any>,
  );
}
