import { faker } from "@faker-js/faker";
import {
  type Account,
  type Employee,
  type Organization,
  Prisma,
  type User,
} from "@mioto/prisma";
import { testPrisma } from "@mioto/server/db/testPrisma";
import { omit } from "remeda";

const password = "Th@t!shardToGuess";
const hashedPassword =
  "$argon2id$v=19$m=15360,t=2,p=1$G6IkVa7e5SDHgeAGqcATfQ$HpzqEJ8IBkEQWWw2oKHjxlbxx8PQeYhNLh+DoLY8OOc";

export class EmployeeFixture {
  private createdEmployees: Employee[] = [];

  create = (organization?: Organization) => {
    faker.seed();

    const org =
      organization ??
      ({
        createdAt: new Date(),
        name: faker.company.name(),
        slug: faker.string.uuid(),
        updatedAt: new Date(),
        uuid: faker.string.uuid(),
        homepageUrl: "https://mioto.app",
        analyticsKey: null,
      } satisfies Organization);

    const user = {
      uuid: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "ADMIN",
      isBlocked: false,
      organizationUuid: org.uuid,
      status: "ACTIVE",
    } satisfies User;

    const account = {
      password,
      email: faker.internet.email().toLowerCase(),
      emailIsVerified: true,
      privacyVersion: 2,
      termsVersion: 2,
      userUuid: user.uuid,
    } satisfies Account;

    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const employee = {
      firstname,
      lastname,
      name: `${firstname} ${lastname}`,
      accessCode: "testing",
      userUuid: user.uuid,
    } satisfies Employee & { name: string };

    return {
      employee,
      organization: org,
      user,
      account,
    };
  };

  async insert(organization?: Organization) {
    faker.seed();

    const newUser = this.create(organization);

    await testPrisma.employee.create({
      data: {
        ...omit(newUser.employee, ["userUuid", "name"]),
        User: {
          create: {
            ...omit(newUser.user, ["organizationUuid"]),
            Organization: {
              create: {
                ...newUser.organization,
                ClientPortal: { create: {} },
              },
            },
            Account: {
              create: {
                password: hashedPassword,
                ...omit(newUser.account, ["password", "userUuid"]),
              },
            },
          },
        },
      },
    });

    return newUser;
  }

  async remove(userUuid: string) {
    try {
      await testPrisma.user.delete({ where: { uuid: userUuid } });
    } catch (e) {
      if (e instanceof Prisma.Prisma.PrismaClientKnownRequestError) {
        return;
      }
      throw e;
    }
  }

  async cleanup() {
    for (const user of this.createdEmployees) {
      await this.remove(user.userUuid);
    }
  }
}

export type TEmployee = Awaited<ReturnType<EmployeeFixture["insert"]>>;
