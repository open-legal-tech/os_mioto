import { faker } from "@faker-js/faker";
import {
  type Account,
  type Customer,
  type Organization,
  Prisma,
  type User,
} from "@mioto/prisma";
import { testPrisma } from "@mioto/server/db/testPrisma";
import { omit } from "remeda";

const password = "Th@t!shardToGuess";
const hashedPassword =
  "$argon2id$v=19$m=15360,t=2,p=1$G6IkVa7e5SDHgeAGqcATfQ$HpzqEJ8IBkEQWWw2oKHjxlbxx8PQeYhNLh+DoLY8OOc";

export class CustomerFixture {
  private createdCustomers: Customer[] = [];

  create = (
    organization: Omit<
      Organization,
      "logoUuid" | "squareLogoUuid" | "bannerUuid" | "backgroundUuid"
    >,
  ) => {
    faker.seed();

    const user = {
      uuid: faker.string.uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "CUSTOMER",
      isBlocked: false,
      organizationUuid: organization.uuid,
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
    const customer = {
      firstname,
      lastname,
      name: `${firstname} ${lastname}`,
      company: "Mioto Labs",
      referenceNumber: "r12345",
      userUuid: user.uuid,
      hasPortalAccess: true,
    } satisfies Customer & { name: string };

    return {
      customer,
      organization,
      user,
      account,
    };
  };

  async insert(organization: Organization) {
    faker.seed();

    const newUser = this.create(organization);

    await testPrisma.customer.create({
      data: {
        ...omit(newUser.customer, ["userUuid"]),
        User: {
          create: {
            ...omit(newUser.user, ["organizationUuid"]),
            Organization: {
              create: newUser.organization,
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
    for (const user of this.createdCustomers) {
      await this.remove(user.userUuid);
    }
  }
}

export type TCustomer = ReturnType<CustomerFixture["create"]>;
