import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { ClientRendererPage } from "./utils/pages/ClientRendererPage";
import { PortalClientsPageModel } from "./utils/pages/PortalClientsPage";
import { TreeDashboardPageModel } from "./utils/pages/TreeDashboardPage";
import { test } from "./utils/pwTest";
import { expect } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("share tree with client", async ({ employeeSzenario }) => {
  test.slow();
  const { ClientsPage } =
    await test.step("configure client portal", async () => {
      const ClientsPage = new PortalClientsPageModel(employeeSzenario);
      await ClientsPage.goto();

      const Settings = await ClientsPage.gotoConfigureClientPortal();

      await Settings.uploadAGB(
        path.join(__dirname, "client.assets/portal-test-agb.pdf"),
      );

      await Settings.uploadLogo(path.join(__dirname, "client.assets/Logo.png"));

      await Settings.uploadBackground(
        path.join(__dirname, "client.assets/Background.png"),
      );

      await ClientsPage.goto();

      return { ClientsPage };
    });

  const { CustomerDashboardPage, newClient, customerSzenario } =
    await test.step("Create new Customer", async () => {
      const newClient = employeeSzenario.environment.Customer.create(
        employeeSzenario.employee.organization,
      );
      const { CustomerRegistrationPage, customerSzenario } =
        await ClientsPage.createNewCustomer(newClient);

      const CustomerDashboardPage = await CustomerRegistrationPage.register();

      await expect(
        CustomerDashboardPage.szenario.environment.page.getByRole("heading", {
          name: "Keine Anwendungen",
        }),
      ).toBeVisible();

      const ClientCard = ClientsPage.ClientCard(newClient.customer.name);
      const ShareDialog = await ClientCard.share();

      await ShareDialog.locators.treeSelector.trigger.click();

      // Since no version of any tree exists we expect no trees to be shareable.
      await expect(
        ShareDialog.locators.treeSelector.item(
          "Keine Auswahlmöglichkeit gefunden",
        ),
      ).toBeVisible();

      return {
        CustomerDashboardPage,
        newClient,
        customerSzenario,
      };
    });

  const { EditorPage } =
    await test.step("Create a tree and a version", async () => {
      const TreeDashboardPage = new TreeDashboardPageModel(employeeSzenario);
      await TreeDashboardPage.goto();

      const EditorPage = await TreeDashboardPage.createProject(
        "Basic shareable Tree",
      );

      const InfoNode1 = await EditorPage.Editor.createNode({
        nodeName: "Block 1",
        type: "info",
      });

      await InfoNode1.sidebar.RichTextEditor.fill("The Startblock");

      const InfoNode2 = await InfoNode1.canvasNode.createNewNodeFromPort({
        currentNodeName: "Block 1",
        newNodeName: "Block 2",
        type: "info",
        select: true,
      });

      await InfoNode2.sidebar.RichTextEditor.fill("The Endblock");

      await EditorPage.Header.projectMenuDropdown.createVersion();

      return { EditorPage };
    });

  await test.step("Share the tree with the customer", async () => {
    await ClientsPage.goto();
    const ShareDialog = await ClientsPage.ClientCard(
      newClient.customer.name,
    ).share();

    await ShareDialog.selectTree("Basic shareable Tree");
    await ShareDialog.locators.sessionInput.fill("1");
    await ShareDialog.locators.submit.click();
  });

  await test.step("Consume the tree as the customer", async () => {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await CustomerDashboardPage.szenario.environment.page.waitForTimeout(200);
    await CustomerDashboardPage.szenario.environment.page.reload();

    const TreeCard = CustomerDashboardPage.TreeCard("Basic shareable Tree");

    await expect(TreeCard.locators.title).toBeVisible();

    await TreeCard.createSession();

    await expect(
      customerSzenario.environment.page.getByText("The Startblock"),
    ).toBeVisible();

    const RendererPage = new ClientRendererPage(
      customerSzenario,
      EditorPage.tree.uuid,
    );
    await RendererPage.Renderer.next();

    await expect(
      RendererPage.szenario.environment.page.getByText("The Endblock"),
    ).toBeVisible();

    await CustomerDashboardPage.goto();

    await expect(TreeCard.locators.newSession).toBeDisabled();

    const PreviousSession = TreeCard.locators.previousSession(
      "Basic shareable Tree",
    );
    await expect(PreviousSession.title).toBeVisible();

    await PreviousSession.continueLink.click();

    await customerSzenario.environment.page.waitForURL("**/render/**");

    await expect(
      customerSzenario.environment.page.getByText("The Endblock"),
    ).toBeVisible();
  });
});
