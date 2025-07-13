import prisma from "@mioto/prisma";

export async function getOrgBySlug(slug: string) {
  return await prisma.organization.findUnique({
    where: {
      slug,
    },
  });
}
