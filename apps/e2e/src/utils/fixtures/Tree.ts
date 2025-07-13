import { faker } from "@faker-js/faker";
import { Failure, FatalError } from "@mioto/errors";
import { type Employee, Prisma, type Tree, type User } from "@mioto/prisma";
import { testPrisma } from "@mioto/server/db/testPrisma";
import { createSnapshot } from "@mioto/workflow-builder/db/createSnapshot";
import { basicYDoc } from "./mocks/basicTree-yDoc";
import { emptyYDoc } from "./mocks/empty-yDoc";

const docs = {
  empty: emptyYDoc,
  basicTree: basicYDoc,
};

type TreeCreationData = Partial<Tree>;

export class TreeFixture {
  private createdTrees: Record<string, Prisma.Tree> = {};
  private createdVersions: Record<string, Prisma.TreeSnapshot> = {};
  private createdTemplates: Record<string, Prisma.File> = {};

  async insert({
    document,
    employee,
    ...tree
  }: Omit<TreeCreationData, "document"> & {
    document: keyof typeof docs;
    employee: Employee & User;
  }) {
    const yDoc = docs[document];

    const createdTree = await testPrisma.tree.create({
      data: {
        name: faker.lorem.words(5),
        document: yDoc as any,
        organizationUuid: employee.organizationUuid,
        Employee: {
          connect: { userUuid: employee.userUuid },
        },
        ...tree,
      },
    });

    this.createdTrees[createdTree.uuid] = createdTree;
    return createdTree;
  }

  async createVersion(treeUuid: string, userUuid: string) {
    const employee = await testPrisma.employee.findUnique({
      where: {
        userUuid: userUuid,
      },
      include: {
        User: true,
      },
    });

    if (!employee) throw new FatalError({ code: "employee_not_found" });

    const version = await createSnapshot(testPrisma)({
      treeUuid,
      user: {
        uuid: employee.userUuid,
        role: employee.User.role,
        organizationUuid: employee.User.organizationUuid,
        type: "employee",
      },
    });

    if (version instanceof Failure) throw version;

    this.createdVersions[version.data.snapshot.uuid] = version.data.snapshot;
    version.data.templates.forEach((template) => {
      this.createdTemplates[template.destinationFile.uuid] =
        template.destinationFile;
    });

    return version;
  }

  async remove(treeUuid: string) {
    try {
      await testPrisma.tree.delete({ where: { uuid: treeUuid } });
    } catch (e) {
      if (e instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
        return;
      }
      throw e;
    }
  }

  async removeTreeSnapshot(treeUuid: string) {
    try {
      await testPrisma.treeSnapshot.delete({ where: { uuid: treeUuid } });
    } catch (e) {
      if (e instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
        return;
      }
      throw e;
    }
  }

  async removeTemplate(fileUuid: string) {
    try {
      await testPrisma.template.delete({ where: { fileUuid } });
    } catch (e) {
      if (e instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
        return;
      }
      throw e;
    }
  }

  async cleanup() {
    await Promise.all([
      ...Object.values(this.createdVersions).map(({ uuid }) =>
        this.removeTreeSnapshot(uuid),
      ),
      ...Object.values(this.createdTrees).map(({ uuid }) => this.remove(uuid)),
      ...Object.values(this.createdTemplates).map(({ uuid }) =>
        this.removeTemplate(uuid),
      ),
    ]);
  }

  addCreatedTree(tree: Prisma.Tree) {
    this.createdTrees[tree.uuid] = tree;
  }

  addCreatedTreeVersion(tree: Prisma.TreeSnapshot) {
    this.createdVersions[tree.uuid] = tree;
  }

  addCreatedTemplate(template: Prisma.File) {
    this.createdTemplates[template.uuid] = template;
  }
}
