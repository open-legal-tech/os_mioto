import prisma from "@mioto/prisma";

export async function getUnauthorizedSession(sessionUuid: string) {
  return await prisma.session.findUnique({
    where: {
      uuid: sessionUuid,
    },
    include: {
      Owner: {
        include: {
          Organization: true,
        },
      },
      Tree: true,
    },
  });
}
