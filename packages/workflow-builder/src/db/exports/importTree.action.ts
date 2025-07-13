"use server";

import { Buffer } from "node:buffer";
import { Failure } from "@mioto/errors";
import { getTranslations } from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import * as Y from "yjs";
import { z } from "zod";
import { autoFix } from "../../tree/exports/autoFix";
import { createYDocWithInitialState } from "../../tree/utils/exports/createYDocWithInitialState";

const importInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  fileData: z.array(z.number()).optional(),
  treeData: z.any().optional(),
});

type TImportInput = z.infer<typeof importInput>;

export async function importTreeAction(inputs: TImportInput) {
  const t = await getTranslations();
  const { name, description, fileData, treeData } = importInput.parse(inputs);

  if (!fileData && !treeData) {
    return {
      success: false,
      failure: new Failure({ code: "no_file" }).body(),
    } as const;
  }

  const { user, db, redirect, revalidatePath } = await getCurrentEmployee();

  let data = fileData ? Buffer.from(fileData) : undefined;

  if (!data && treeData) {
    const { yDoc, yMap, store } = createYDocWithInitialState(
      JSON.parse(treeData),
    );

    try {
      const fixMap = await autoFix({
        store,
        yMap,
        t,
      });

      if (fixMap instanceof Failure)
        return { success: false, failure: fixMap.body() };
    } catch (e) {
      if (e instanceof Error) {
        return {
          success: false,
          failure: new Failure({ code: e.message }).body(),
        } as const;
      }

      console.log(e);
      return {
        success: false,
        failure: new Failure({ code: "unknown_error" }).body(),
      };
    }

    data = Buffer.from(Y.encodeStateAsUpdate(yDoc));
  }

  const createdTree = await db.tree.create({
    data: {
      name: name,
      description,
      document: data,
      organizationUuid: user.organizationUuid,
      Employee: {
        connect: {
          userUuid: user.uuid,
        },
      },
    },
  });

  revalidatePath(`/dashboard`);

  return redirect(`/builder/${createdTree.uuid}`);
}
