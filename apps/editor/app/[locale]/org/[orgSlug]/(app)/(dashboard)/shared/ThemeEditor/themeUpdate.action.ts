"use server";

import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { Theme } from "@mioto/workflow-builder/tree/types";

export async function themeUpdateAction(formdata: FormData) {
  const id = formdata.get("id") as string;
  const theme = formdata.get("theme") as File;
  const customCss = formdata.get("customCss") as File | undefined;
  const fileName = formdata.get("fileName") as string;

  if (!id) {
    throw new Error("No theme id provided");
  }

  try {
    const fileData = theme
      ? JSON.parse(Buffer.from(await theme.arrayBuffer()).toString("utf-8"))
      : undefined;

    const customCssData = customCss
      ? Buffer.from(await customCss.arrayBuffer()).toString("utf-8")
      : undefined;

    if (fileData) {
      const parsedFile = Theme.safeParse(fileData);

      if (!parsedFile.success) {
        return {
          success: false,
          failure: "invalid_file",
          issues: parsedFile.error.toString(),
        } as const;
      }
    }

    const { db, user, revalidatePath } = await getCurrentEmployee();

    await db.theme.update({
      where: { uuid: id },
      data: {
        content: fileData,
        customCss: customCssData,
        name: fileName,
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
