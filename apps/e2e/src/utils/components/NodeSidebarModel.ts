import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import { mapValues } from "remeda";
import type { EnvironmentModel } from "../environments/Environment";
import { NodeMenuModel } from "./NodeMenuModel";
import { TypeDropdownModel } from "./TypeDropdownModel";
import type { NodeOptions } from "./shared";

export class NodeSidebarModel<const TTabs extends Record<string, any>> {
  readonly environment: EnvironmentModel;
  readonly header: {
    typeDropdown: TypeDropdownModel;
    nodeMenu: NodeMenuModel;
    locators: {
      nameInput: Locator;
      tabs?: Record<keyof TTabs, Locator>;
    };
  };
  protected nodeName: string;

  private tabs: TTabs;

  constructor(
    environment: EnvironmentModel,
    type: NodeOptions,
    nodeName: string,
    tabs: TTabs,
  ) {
    this.environment = environment;

    this.tabs = tabs;
    this.nodeName = nodeName;
    this.header = {
      typeDropdown: new TypeDropdownModel(environment, type, nodeName),
      nodeMenu: new NodeMenuModel(environment, this.nodeName),
      locators: {
        nameInput: environment.page.locator(
          `label >> text=${de.packages["node-editor"].nodeEditingSidebar.nameInput.label}`,
        ),
        tabs: mapValues(tabs, (_tab, key) =>
          environment.page.getByRole("radio", { name: key as string }),
        ) as Record<keyof TTabs, Locator>,
      },
    };
  }

  async switchToTab<TKey extends keyof TTabs>(tab: TKey) {
    await this.header.locators.tabs?.[tab].click();

    return new this.tabs[tab](this.environment) as InstanceType<TTabs[TKey]>;
  }

  async updateName(newName: string) {
    this.nodeName = newName;
    await this.header.locators.nameInput.fill(newName);
  }
}
