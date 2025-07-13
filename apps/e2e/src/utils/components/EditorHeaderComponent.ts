import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";
import { HeaderComponent } from "./HeaderComponent";
import { NodeSearch } from "./NodeSearch";
import { ProjectMenuComponent } from "./ProjectMenuComponent";

export class EditorHeaderComponent<
  TData extends SzenarioData,
> extends HeaderComponent<TData> {
  readonly title: string;
  readonly nodeSearch: NodeSearch;
  readonly projectMenuDropdown: ProjectMenuComponent;

  constructor(szenario: EmployeeSzenario<TData>, title: string) {
    super(szenario);

    this.title = title;
    this.nodeSearch = new NodeSearch(szenario.environment);
    this.projectMenuDropdown = new ProjectMenuComponent(
      szenario.environment,
      title,
    );
  }
}
