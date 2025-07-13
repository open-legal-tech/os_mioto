"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { Theme } from "@mioto/workflow-builder/tree/types";

export async function themeUploadAction(formdata: FormData) {
  const theme = formdata.get("theme") as File;
  const customCss = formdata.get("customCss") as File | undefined;
  const name = formdata.get("name") as string;

  if (!theme || !name) {
    throw new Error("No file provided");
  }

  try {
    const fileData = JSON.parse(
      Buffer.from(await theme.arrayBuffer()).toString("utf-8"),
    );

    const customCssData = customCss
      ? Buffer.from(await customCss.arrayBuffer()).toString("utf-8")
      : undefined;

    const parsedFile = Theme.safeParse(fileData);

    if (!parsedFile.success) {
      return {
        success: false,
        failure: "invalid_file",
        issues: parsedFile.error.toString(),
      } as const;
    }

    const { db, user, revalidatePath } = await getCurrentEmployee();

    await db.theme.create({
      data: {
        content: fileData,
        customCss: customCssData,
        name,
        organizationUuid: user.organizationUuid,
      },
    });

    revalidatePath("/settings");
    return { success: true } as const;
  } catch (e) {
    return {
      success: false,
      failure: "invalid_file",
    } as const;
  }
}
