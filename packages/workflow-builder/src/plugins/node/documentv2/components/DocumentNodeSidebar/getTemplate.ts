import { Failure } from "@mioto/errors";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";

export async function getTemplate({
  treeInternalTemplateUuid,
  treeUuid,
}: {
  treeInternalTemplateUuid: string;
  treeUuid: string;
}) {
  const { db } = await getCurrentEmployee();

  const result = await db.tree.findUnique({
    where: {
      uuid: treeUuid,
    },
    select: {
      Template: {
        where: {
          treeInternalUuid: treeInternalTemplateUuid,
        },
        select: {
          File: {
            select: {
              displayName: true,
            },
          },
        },
      },
    },
  });

  const template = result?.Template[0];

  if (!result || !template)
    return {
      success: false,
      failure: new Failure({ code: "template_not_found" }).body(),
    } as const;

  return {
    success: true,
    data: {
      displayName: template.File.displayName,
    },
  } as const;
}
