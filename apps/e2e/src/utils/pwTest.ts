import { test as base } from "@playwright/test";
import {
  createAnonymusSzenario,
  createEmployeeSzenario,
  createMixedTreesSzenario,
  createPublicTreeSzenario,
} from "./szenarios/szenarios";

type Szenario = {
  employeeSzenario: Awaited<ReturnType<typeof createEmployeeSzenario>>;
  anonymusSzenario: Awaited<ReturnType<typeof createAnonymusSzenario>>;
  publicTreeSzenario: Awaited<ReturnType<typeof createPublicTreeSzenario>>;
  mixedTreesSzenario: Awaited<ReturnType<typeof createMixedTreesSzenario>>;
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  _autoSnapshotSuffix: void;
};

export const test = base.extend<Szenario>({
  _autoSnapshotSuffix: [
    // biome-ignore lint/correctness/noEmptyPattern: <explanation>
    async ({}, use, testInfo) => {
      testInfo.snapshotSuffix = "";
      await use();
    },
    { auto: true },
  ],
  employeeSzenario: async ({ page, context, browser }, use) => {
    const testInfo = test.info();

    const employeeSzenario = await createEmployeeSzenario({
      context,
      page,
      testInfo,
      browser,
    });

    await use(employeeSzenario);

    await employeeSzenario.cleanup();
  },
  anonymusSzenario: async ({ page, context, browser }, use) => {
    const testInfo = test.info();

    const anonymusSzenario = await createAnonymusSzenario({
      context,
      page,
      testInfo,
      browser,
    });

    await use(anonymusSzenario);

    await anonymusSzenario.cleanup();
  },
  publicTreeSzenario: async ({ page, context, browser }, use) => {
    const testInfo = test.info();

    const publicTreeSzenario = await createPublicTreeSzenario({
      context,
      page,
      testInfo,
      browser,
    });

    await use(publicTreeSzenario);

    await publicTreeSzenario.cleanup();
  },
  mixedTreesSzenario: async ({ page, context, browser }, use) => {
    const testInfo = test.info();

    const mixedTreesSzenario = await createMixedTreesSzenario({
      context,
      page,
      testInfo,
      browser,
    });

    await use(mixedTreesSzenario);

    await mixedTreesSzenario.cleanup();
  },
});
