import { expect } from "@playwright/test";
import type { EmployeeSzenario } from "./utils/szenarios/EmployeeSzenario";
import { createAnonymusSzenario } from "./utils/szenarios/szenarios";
import { PublicRendererPageModel } from "./utils/pages/PublicRendererPage";
import { test } from "./utils/pwTest";

async function createRenderer(publicTreeSzenario: EmployeeSzenario) {
  const newContext = await publicTreeSzenario.environment.browser.newContext();
  const anonymusUserSzenario = await createAnonymusSzenario({
    ...publicTreeSzenario.environment,
    context: newContext,
    page: await newContext.newPage(),
  });

  const Renderer = new PublicRendererPageModel(anonymusUserSzenario, {
    orgSlug: publicTreeSzenario.employee.organization.slug,
    treeId: publicTreeSzenario.data.trees.publicTree.uuid,
  });

  return Renderer;
}

test("should allow submitting answer @mobile", async ({
  publicTreeSzenario,
}) => {
  const Renderer = await createRenderer(publicTreeSzenario);

  await Renderer.goto();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("1 Block");

  await Renderer.Renderer.next();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("2 Block");

  await Renderer.Renderer.Nodes.form.Select.selectAnswer("Ja");

  await Renderer.Renderer.next();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("3 Block");

  await Renderer.Renderer.next();

  await expect(
    Renderer.anonymusSzenario.environment.page.getByText(
      "Erfolgreich abgeschlossen",
    ),
  ).toBeVisible();
});

test("should restore on local reload @mobile", async ({
  publicTreeSzenario,
}) => {
  const Renderer = await createRenderer(publicTreeSzenario);

  await Renderer.goto();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("1 Block");

  await Renderer.Renderer.next();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("2 Block");

  await Renderer.Renderer.Nodes.form.Select.selectAnswer("Ja");

  await Renderer.Renderer.next();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("3 Block");

  await Renderer.Renderer.next();

  await expect(
    Renderer.anonymusSzenario.environment.page.getByText(
      "Erfolgreich abgeschlossen",
    ),
  ).toBeVisible();

  await Promise.all([
    Renderer.Renderer.environment.page.waitForResponse(
      Renderer.Renderer.environment.page.url(),
    ),
    Renderer.Renderer.environment.page.reload(),
  ]);

  await expect(
    Renderer.anonymusSzenario.environment.page.getByText(
      "Erfolgreich abgeschlossen",
    ),
  ).toBeVisible();
});

test("should not restore on remote load @mobile", async ({
  publicTreeSzenario,
}) => {
  const Renderer = await createRenderer(publicTreeSzenario);

  await Renderer.goto();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("1 Block");

  await Renderer.Renderer.next();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("2 Block");

  await Renderer.Renderer.Nodes.form.Select.selectAnswer("Ja");

  await Renderer.Renderer.next();

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("3 Block");

  await Renderer.Renderer.next();

  await expect(
    Renderer.anonymusSzenario.environment.page.getByText(
      "Erfolgreich abgeschlossen",
    ),
  ).toBeVisible();

  const newContext = await Renderer.Renderer.environment.browser.newContext();
  const newPage = await newContext.newPage();

  await newPage.goto(Renderer.Renderer.environment.page.url());

  await expect(newPage.getByText("1 Block")).toBeVisible();
});

test.describe("history @mobile", () => {
  test("should remember answers when going back and forth", async ({
    publicTreeSzenario,
  }) => {
    const Renderer = await createRenderer(publicTreeSzenario);

    await Renderer.goto();

    await Renderer.Renderer.next();
    await Renderer.Renderer.Nodes.form.Select.selectAnswer("Ja");
    await Renderer.Renderer.next();
    await Renderer.Renderer.back();

    await expect(
      Renderer.Renderer.Nodes.form.Select.getAnswerLocator("Ja"),
    ).toBeChecked();

    await Renderer.Renderer.Nodes.form.Select.selectAnswer("Nein");

    await Renderer.Renderer.next();
    await Renderer.Renderer.back();

    await expect(
      Renderer.Renderer.Nodes.form.Select.getAnswerLocator("Nein"),
    ).toBeChecked();
  });

  test("should preserve history when reloading the page", async ({
    publicTreeSzenario,
  }) => {
    const Renderer = await createRenderer(publicTreeSzenario);

    await Renderer.goto();

    await Renderer.Renderer.next();
    await Renderer.Renderer.Nodes.form.Select.selectAnswer("Ja");
    await Renderer.Renderer.next();

    await Promise.all([
      Renderer.Renderer.environment.page.waitForResponse(
        Renderer.Renderer.environment.page.url(),
      ),
      Renderer.Renderer.environment.page.reload(),
    ]);

    await Renderer.Renderer.back();

    await expect(
      Renderer.Renderer.Nodes.form.Select.getAnswerLocator("Ja"),
    ).toBeChecked();
  });
});

test("should show error when answer left blank @mobile", async ({
  publicTreeSzenario,
}) => {
  const Renderer = await createRenderer(publicTreeSzenario);

  await Renderer.goto();

  await Renderer.Renderer.next();
  await Renderer.Renderer.next();

  await expect(
    Renderer.anonymusSzenario.environment.page.getByRole("alert", {
      name: "Eine Auswahl muss getroffen werden.",
    }),
  ).toBeVisible();
});

test("/new should be backwards compatible", async ({ publicTreeSzenario }) => {
  const Renderer = await createRenderer(publicTreeSzenario);

  await Renderer.Renderer.environment.page.goto(`${Renderer.meta.url}/new`);

  await expect(
    Renderer.Renderer.RichTextRenderer.locators.container,
  ).toContainText("1 Block");
});

// TODO Delete after 31.08.2024
// test("urls with tokens should be backwards compatible", async ({
//   publicTreeSzenario,
// }) => {
//   const Renderer = await createRenderer(publicTreeSzenario);

//   await Renderer.goto();
//   await Renderer.Renderer.next();

//   const localStorage =
//     await Renderer.Renderer.environment.context.storageState();

//   const [sessionUuid, userUuid] =
//     localStorage.origins
//       .flatMap((o) => o.localStorage)
//       .find(
//         ({ name }) => name === publicTreeSzenario.data.trees.publicTree.uuid,
//       )
//       ?.value.split("__") ?? [];

//   if (!userUuid || !sessionUuid)
//     throw new Error("Session and userUuid cannot be found in localstorage");

//   const token = (await createAnonymusUserToken({ userUuid })).token;

//   const newContext = await Renderer.Renderer.environment.browser.newContext();
//   const newPage = await newContext.newPage();

//   await newPage.goto(`${Renderer.meta.url}/${sessionUuid}?token=${token}`);
//   await expect(newPage.locator("data-test=richTextEditor")).toContainText(
//     "2 Block",
//   );
// });
