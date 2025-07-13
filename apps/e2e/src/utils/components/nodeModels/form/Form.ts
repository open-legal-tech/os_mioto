import type { TFormInputTypes } from "@mioto/workflow-builder/plugin/form/types";
import { EnvironmentModel } from "../../../environments/Environment";
import { t } from "../../../translator";
import { CanvasNodeComponent } from "../../CanvasNode";
import { InputTypeDropdownComponent } from "../../InputTypeDropdown";
import { LogicUIModel } from "../../LogicUIModel";
import { NodeSidebarModel } from "../../NodeSidebarModel";
import { RichTextEditorModel } from "../../RichTextEditorModel";
import type { Nodes } from "../Nodes";
import { createNewNodeFromPort } from "../utils/createNewNodeFromPort";
import { FileRendererModel } from "./FileRendererModel";
import { MultiSelectRendererModel } from "./MultiSelectRendererModel";
import { NumberRendererModel } from "./NumberRendererModel";
import { SingleSelectRendererModel } from "./SingleSelectRendererModel";
import { TextRendererModel } from "./TextRendererModel";

export class FormNodeModel {
  readonly environment: EnvironmentModel;
  readonly nodeName: string;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;
    this.nodeName = nodeName;
  }

  get renderer() {
    return new FormNodeRendererModel(this.environment);
  }

  get sidebar() {
    return new FormNodeSidebarModel(this.environment, this.nodeName);
  }

  get canvasNode() {
    return new FormNodeCanvasNodeModel(this.environment, this.nodeName, "form");
  }
}

export class FormNodeRendererModel {
  readonly environment: EnvironmentModel;
  get Select() {
    return new SingleSelectRendererModel(this.environment);
  }

  get Text() {
    return new TextRendererModel(this.environment);
  }

  get MultiSelect() {
    return new MultiSelectRendererModel(this.environment);
  }

  get Number() {
    return new NumberRendererModel(this.environment);
  }

  get File() {
    return new FileRendererModel(this.environment);
  }

  get locators() {
    return {
      input: {
        label: (text: string) =>
          this.environment.page.getByRole("button", { name: text }),
        option: (text: string) =>
          this.environment.page.locator(`label >> text=${text}`),
      },
    };
  }

  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  async scrollToInput(labelText: string) {
    await this.locators.input.label(labelText).scrollIntoViewIfNeeded();
  }
}

const tabs = {
  Inhalt: EnvironmentModel,
  Verbindungen: LogicUIModel,
};

export class FormNodeSidebarModel extends NodeSidebarModel<typeof tabs> {
  readonly richTextEditor: RichTextEditorModel;
  readonly locators: {
    addInputButton: InputTypeDropdownComponent;
    input: (name: string, position?: number) => InputConfig;
  };

  constructor(environment: EnvironmentModel, nodeName: string) {
    super(environment, "form", nodeName, tabs);

    this.richTextEditor = new RichTextEditorModel(environment);
    this.locators = {
      addInputButton: new InputTypeDropdownComponent(environment),

      input: (name: string, position?: number) =>
        new InputConfig(environment, { name, position }),
    };
  }

  async scrollToInput(name: string, inputNumber: number) {
    await this.locators
      .input(name, inputNumber)
      .locators.input.scrollIntoViewIfNeeded();
  }

  async addInput<TKey extends keyof typeof Inputs>(type: TKey, name: string) {
    await this.locators.addInputButton.selectOption(
      t(`plugins.node.form.${type}.name`),
    );

    return new Inputs[type](this.environment, { name }) as InstanceType<
      (typeof Inputs)[TKey]
    >;
  }
}

export class FormNodeCanvasNodeModel extends CanvasNodeComponent<"form"> {
  override async selectNode(params?: {
    content: string;
    type: "form";
  }): Promise<FormNodeModel> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.getUnselectedNodeLocator(params?.content ?? this.nodeName).click(),
    ]);

    return new FormNodeModel(
      this.environment,
      params?.content ?? this.nodeName,
    );
  }

  override async createNewNodeFromPort<TType extends keyof Nodes>({
    coordinates = [100, 100],
    newNodeName,
    type,
    select,
  }: {
    currentNodeName: string;
    newNodeName: string;
    coordinates?: [number, number];
    type: TType;
    select?: boolean;
  }): Promise<ReturnType<Nodes[typeof type]>> {
    return createNewNodeFromPort({
      plugin: this,
      coordinates,
      newNodeName,
      newNodeType: type,
      select,
    });
  }
}

type InputConfigConstructorParams = {
  name: string;
  position?: number;
};

class InputConfig {
  readonly environment: EnvironmentModel;
  readonly name: string;
  readonly position?: number;

  get locators() {
    const input = this.environment.page.getByRole("listitem", {
      name: `Eingabe ${this.name ?? ""} an Stelle ${this.position}`,
    });

    const typeDropdownMenu = input.getByRole("menu", {
      name: "Eingabetyp auswählen",
    });

    return {
      input,
      typeDropdown: {
        button: input.getByRole("button", {
          name: "Eingabetyp auswählen",
        }),
        menu: typeDropdownMenu,
        item: (title: string) =>
          typeDropdownMenu.getByRole("menuitem", { name: title }),
      },
      nameInput: input.getByRole("textbox", { name: "Eingabename" }),
      inputCard: this.environment.page.getByRole("listitem", {
        name: this.name,
      }),
    };
  }

  constructor(
    environment: EnvironmentModel,
    { name, position = 1 }: InputConfigConstructorParams,
  ) {
    this.environment = environment;

    this.name = name;
    this.position = position;
  }

  async openTypeDropdown() {
    await this.locators.typeDropdown.button.click();
  }

  async changeType<TKey extends TFormInputTypes>(
    type: TKey,
  ): Promise<InstanceType<(typeof Inputs)[TKey]>> {
    await this.openTypeDropdown();

    const InputConfig = new Inputs[type](this.environment, {
      name: this.name,
      position: this.position,
    }) as InstanceType<(typeof Inputs)[TKey]>;

    await this.locators.typeDropdown.item(InputConfig.name).click();

    return InputConfig;
  }
}

class SelectInput extends InputConfig {
  override name = "Einfachauswahl";

  override get locators() {
    return {
      ...super.locators,
      answerOption: (nth = 0) =>
        this.environment.page.getByLabel(`Antwortoption ${nth}`),
      addOptionButton: this.environment.page.getByRole("button", {
        name: "Neue Antwort",
      }),
    };
  }

  async addAnswerOption(inputNumber: number, optionText: string) {
    const inputCard = this.locators.inputCard;

    await inputCard.scrollIntoViewIfNeeded();
    await inputCard.click();

    await inputCard.click();
    await this.locators.answerOption(inputNumber).fill(optionText);
  }
}
class NumberInput extends InputConfig {
  override name = "Zahleneingabe";
}
class MultiSelectInput extends InputConfig {
  override name = "Mehrfachauswahl";

  override get locators() {
    return {
      ...super.locators,
      answerOption: (nth = 0) =>
        this.environment.page.getByLabel(`Antwortoption ${nth}`),
      addOptionButton: this.environment.page.getByRole("button", {
        name: "Neue Antwort",
      }),
    };
  }

  async addAnswerOption(inputNumber: number, optionText: string) {
    const card = this.locators.inputCard;

    await card.scrollIntoViewIfNeeded();
    await this.locators.addOptionButton.click();
    await this.locators.answerOption(inputNumber).fill(optionText);
  }
}
class TextInput extends InputConfig {
  override name = "Texteingabe";
}
class TextFeld extends InputConfig {
  override name = "Textfeld";
}

class FileInput extends InputConfig {
  override name = "Dateiupload";

  override get locators() {
    return {
      ...super.locators,
      acceptPdfCheckbox: super.locators.inputCard.getByRole("checkbox", {
        name: "PDF",
      }),
      acceptDocxCheckbox: super.locators.inputCard.getByRole("checkbox", {
        name: "Docx",
      }),
    };
  }

  async selectAcceptedFileTypes(fileTypes: ("pdf" | "docx")[]) {
    if (fileTypes.includes("pdf")) {
      this.locators.acceptPdfCheckbox.check();
    } else {
      this.locators.acceptPdfCheckbox.uncheck();
    }

    if (fileTypes.includes("docx")) {
      this.locators.acceptDocxCheckbox.check();
    } else {
      this.locators.acceptDocxCheckbox.uncheck();
    }
  }
}

const Inputs = {
  select: SelectInput,
  number: NumberInput,
  "multi-select": MultiSelectInput,
  text: TextInput,
  textarea: TextFeld,
  file: FileInput,
  // TODO file input config is missing
  date: InputConfig,
  "rich-text": InputConfig,
  email: InputConfig,
} satisfies Record<TFormInputTypes, typeof InputConfig>;
