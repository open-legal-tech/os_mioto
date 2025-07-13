import type { Map as YMap } from "yjs";
import type { TEdgeId, TNodeId } from "../id";
import { createChildNode } from "./creators/createChildNode";
import { createEdge } from "./creators/createEdge";
import { createNode } from "./creators/createNode";
import { createNodeVariable } from "./creators/createNodeVariable";
import { transformEdge } from "./creators/transformEdge";
import { transformNode } from "./creators/transformNode";
import { getEdgeAll } from "./getters/getEdgeAll";
import { getEdgeAllOfType } from "./getters/getEdgeAllOfType";
import { getEdgeMany } from "./getters/getEdgeMany";
import { getEdgeSingle } from "./getters/getEdgeSingle";
import { getEdgesByNode } from "./getters/getEdgesByNode";
import { getNodeAll } from "./getters/getNodeAll";
import { getNodeAllOfType } from "./getters/getNodeAllOfType";
import { getNodeByName } from "./getters/getNodeByName";
import { getNodeMany } from "./getters/getNodeMany";
import { getNodeNames } from "./getters/getNodeNames";
import { getNodeOptions } from "./getters/getNodeOptions";
import { getNodeRemoved } from "./getters/getNodeRemoved";
import { getNodeSingle } from "./getters/getNodeSingle";
import { getNodesByEdge } from "./getters/getNodesByEdge";
import { getStartNodeId } from "./getters/getStartNode";
import { getYNode } from "./getters/getYNode";
import { hasEdge } from "./getters/hasEdge";
import { hasNode } from "./getters/hasNode";
import { createEntityMigrationFn } from "./migrations/createMigrationFn";
import { edgeMigrations } from "./migrations/edgeMigrations";
import { nodeMigrations } from "./migrations/nodeMigrations";
import { addEdge } from "./mutaters/addEdge";
import { addEdgeToNode } from "./mutaters/addEdgeToNode";
import { addNode } from "./mutaters/addNode";
import { deleteEdges } from "./mutaters/deleteEdges";
import { deleteNodes } from "./mutaters/deleteNodes";
import { removeEdgeFromNode } from "./mutaters/removeEdgeFromNode";
import { removeNodeFallbackEdge } from "./mutaters/removeNodeFallbackEdge";
import { updateEdgeOrder } from "./mutaters/reorderEdges";
import { replaceEdge } from "./mutaters/replaceEdge";
import { replaceNode } from "./mutaters/replaceNode";
import { updateEdge } from "./mutaters/updateEdge";
import { updateEdgeSource } from "./mutaters/updateEdgeSource";
import { updateEdgeTarget } from "./mutaters/updateEdgeTarget";
import { updateNode } from "./mutaters/updateNode";
import { updateNodeFallbackEdge } from "./mutaters/updateNodeFallbackEdge";
import { updateNodeFinal } from "./mutaters/updateNodeFinal";
import { updateNodeName } from "./mutaters/updateNodeName";
import { updateNodePosition } from "./mutaters/updateNodePosition";
import type { TTree } from "./type-classes/Tree";
import { getChildren } from "./utils/getChildren";
import { getConnectableNodes } from "./utils/getConnectableNodes";
import { getParents } from "./utils/getParents";
import { getPathsTo } from "./utils/getPaths";
import { getLongestPath, getPathsFrom } from "./utils/getPathsFrom";
import { isCircular } from "./utils/isCircular";
import { isValidEdge } from "./validators/isValidEdge";

export class ReadOnlyTreeClient {
  private tree: TTree;
  private treeMap: YMap<any>;

  constructor(tree: TTree, treeMap: YMap<any>) {
    this.tree = tree;
    this.treeMap = treeMap;
  }

  get nodes() {
    return {
      has: hasNode(this.tree),
      transform: transformNode(this.tree),
      create: {
        node: createNode(this.tree),
        childNode: createChildNode(this.tree),
        variable: createNodeVariable,
      },
      get: {
        single: getNodeSingle(this.tree),
        collection: getNodeMany(this.tree),
        allOfType: getNodeAllOfType(this.tree),
        all: getNodeAll(this.tree),
        connectableNodes: getConnectableNodes(this.tree),
        children: getChildren(this.tree),
        parents: getParents(this.tree),
        pathsTo: getPathsTo(this.tree),
        pathsFrom: getPathsFrom(this.tree),
        longestPathFrom: getLongestPath(this.tree),
        options: getNodeOptions(this.tree),
        names: getNodeNames(this.tree),
        byEdge: getNodesByEdge(this.tree),
        yNode: getYNode(this.treeMap),
        byName: getNodeByName(this.tree),
        removedNodes: getNodeRemoved(this.tree),
      },
    };
  }

  get edges() {
    return {
      has: hasEdge(this.tree),
      create: createEdge(this.tree),
      transform: transformEdge(this.tree),
      get: {
        single: getEdgeSingle(this.tree),
        collection: getEdgeMany(this.tree),
        allOfType: getEdgeAllOfType(this.tree),
        all: getEdgeAll(this.tree),
        byNode: getEdgesByNode(this.tree),
      },
    };
  }

  get = {
    treeMap: () => this.treeMap,
    tree: () => this.tree,
    startNodeId: () => getStartNodeId(this.tree),
    theme: () => this.tree.theme,
  };
}

export type TReadOnlyTreeClient = ReadOnlyTreeClient;

export type TTreeClient = TreeClient;

export class TreeClient {
  private tree: TTree;
  private treeMap: YMap<any>;
  private ReadOnlyTreeClient: ReadOnlyTreeClient;

  constructor(tree: TTree, treeMap: YMap<any>) {
    this.tree = tree;
    this.treeMap = treeMap;
    this.ReadOnlyTreeClient = new ReadOnlyTreeClient(tree, treeMap);
  }

  updateTree(newTree: TTree) {
    this.tree.edges = newTree.edges;
    this.tree.nodes = newTree.nodes;
    this.tree.startNode = newTree.startNode;
    this.tree.theme = newTree.theme;
  }

  updateTheme(newTheme: any) {
    this.tree.theme = newTheme;
  }

  removeTheme() {
    this.tree.theme = undefined;
  }

  get get() {
    return this.ReadOnlyTreeClient.get;
  }

  updateStartNode(startNode: TNodeId) {
    const node = this.nodes.get.single(startNode);

    if (!node) return;

    this.tree.startNode = startNode;
  }

  get nodes() {
    return {
      ...this.ReadOnlyTreeClient.nodes,
      add: addNode(this.tree),
      delete: deleteNodes(this.tree),
      connect: {
        toEdgeAsTarget: updateEdgeTarget(this.tree),
        toEdgeAsSource: updateEdgeSource(this.tree),
      },
      disconnect: {
        /**
         * Disconnecting from an Edge is equivalent to deleting it, because there cannot be
         * an Edge without source and target. If you want to update the connection
         * use nodes.connect.toEdgeAsTarget or edges.connect.toEdgeAsSource.
         */
        fromEdgeAsTarget: (id: TEdgeId) => deleteEdges(this.tree)([id]),
        fromEdgeAsSource: (id: TEdgeId) => deleteEdges(this.tree)([id]),
      },
      update: {
        name: updateNodeName(this.tree),
        position: updateNodePosition(this.tree),
        node: updateNode(this.tree),
        final: updateNodeFinal(this.tree),
        edges: {
          add: addEdgeToNode(this.tree),
          remove: removeEdgeFromNode(this.tree),
          reorder: updateEdgeOrder(this.tree),
        },
        fallbackEdge: updateNodeFallbackEdge(this.tree),
        removeFallbackEdge: removeNodeFallbackEdge(this.tree),
      },
      replace: replaceNode(this.tree, this.treeMap),
      migrate: createEntityMigrationFn(nodeMigrations)(this.tree),
    };
  }

  get edges() {
    return {
      ...this.ReadOnlyTreeClient.edges,
      delete: deleteEdges(this.tree),
      add: addEdge(this.tree),
      rules: {
        isCircular: isCircular(this.tree),
        isValid: isValidEdge(this.tree),
      },
      connect: {
        toTargetNode: updateEdgeTarget(this.tree),
        toSourceNode: updateEdgeSource(this.tree),
      },
      update: updateEdge(this.tree),
      replace: replaceEdge(this.tree),
      migrate: createEntityMigrationFn(edgeMigrations)(this.tree),
    };
  }
}
