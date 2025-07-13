import type prisma from "@mioto/prisma";
import type { enhance } from "@zenstackhq/runtime";

export type DB = ReturnType<typeof enhance<typeof prisma>>;
