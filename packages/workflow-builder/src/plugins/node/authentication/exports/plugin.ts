import type { TChildId } from "../../../../tree/id";
import {
  type INode,
  NodePlugin,
  type createFn,
  type createVariableFn,
} from "../../../../tree/type/plugin/NodePlugin";
import {
  type PrimitiveVariable,
  RecordVariable,
  TextVariable,
  type Variable,
} from "../../../../variables/exports/types";

export const typeName = "authentication" as const;

export type IAuthenticationNode = INode<typeof typeName>;

export class AuthenticationNodePlugin extends NodePlugin<IAuthenticationNode> {
  readonly hasAction = true;
  readonly hasRenderer = false;
  readonly hasWebhook = false;
  readonly hasSidebar = true;
  readonly hasCanvasNode = true;

  override isAddable = () => {
    return false;
  };

  override shouldIncludeInNavigation(
    _variables: Record<`node_${string}`, Variable>,
  ): boolean {
    return false;
  }

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [],
      blockGroup: "system",
    });
  }

  create: createFn<IAuthenticationNode> = (data) => (treeClient) => {
    return treeClient.nodes.create.node<IAuthenticationNode>({
      ...data,
      name: "Mandant",
      type: this.type,
      version: this.version,
      pluginVersion: this.pluginVersion,
    }) satisfies IAuthenticationNode;
  };

  createVariable: createVariableFn<
    PrimitiveVariable<TChildId>,
    | {
        firstName?: string;
        lastName?: string;
        email?: string;
        referenceNumber?: string;
        session: {
          name: string;
        };
      }
    | undefined
  > =
    ({ nodeId, execution = "unexecuted", value: user }) =>
    (treeClient) => {
      const node = this.getSingle(nodeId)(treeClient);
      const firstName = TextVariable.create({
        id: RecordVariable.createChildIdPath(
          nodeId,
          "system_aa733e16-8dd2-4ec3-b57f-bf35353989c2",
        ),
        execution,
        name: "Anwendervorname",
        value: user?.firstName,
      });

      const lastName = TextVariable.create({
        id: RecordVariable.createChildIdPath(
          nodeId,
          "system_266927a2-e6fd-4db1-b6f8-8658c7abc028",
        ),
        execution,
        name: "Anwendernachname",
        value: user?.lastName,
      });

      const email = TextVariable.create({
        id: RecordVariable.createChildIdPath(
          nodeId,
          "system_0ccb1105-7acb-46f5-aa93-4a568a83be61",
        ),
        execution,
        name: "Anwenderemail",
        value: user?.email,
      });

      const referenceNumber = TextVariable.create({
        id: RecordVariable.createChildIdPath(
          nodeId,
          "system_4644bc53-87bb-4dc8-bca5-f3b1b6085e27",
        ),
        execution,
        name: "Anwenderreferenznummer",
        value: user?.referenceNumber,
      });

      const session = TextVariable.create({
        id: RecordVariable.createChildIdPath(
          nodeId,
          "system_14f55fb2-a779-485b-9877-e5a70dcaadd2",
        ),
        execution,
        name: "Sessionname",
        value: user?.session.name,
      });

      return {
        variable: RecordVariable.create({
          value: {
            [firstName.id]: firstName,
            [lastName.id]: lastName,
            [email.id]: email,
            [referenceNumber.id]: referenceNumber,
            [session.id]: session,
          },
          name: node.name,
          id: nodeId,
          status: node.isRemoved ? "missing" : "ok",
          execution,
        }),
      };
    };
}

export const AuthenticationNode = new AuthenticationNodePlugin();
