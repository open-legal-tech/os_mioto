import { PrismaClient } from "@prisma/client";
import Prisma from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient({
    // log: ["query", "info", "warn", "error"],
  }).$extends({
    result: {
      employee: {
        fullName: {
          needs: { firstname: true, lastname: true },
          compute({ firstname, lastname }) {
            if (!firstname && !lastname) return;

            return `${firstname}${` ${lastname}`}`;
          },
        },
      },
      customer: {
        fullName: {
          needs: { firstname: true, lastname: true },
          compute({ firstname, lastname }) {
            if (!firstname && !lastname) return;

            return `${firstname}${` ${lastname}`}`;
          },
        },
      },
    },
  });
};

let prisma = createPrismaClient();

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!(globalThis as any).prisma) {
    (globalThis as any).prisma = createPrismaClient();
  }
  prisma = (globalThis as any).prisma;
}

export default prisma;
export * from "@prisma/client";
export { Prisma };
