import type { TNodeId } from "../../id";
import type { TTree } from "../type-classes/Tree";

function createAdjacencyList<
  T extends {
    source: TNodeId;
    target?: TNodeId;
  }[],
>(array: T) {
  const adjacencyList: Record<TNodeId, TNodeId[]> = {};

  array.forEach(({ source, target }) => {
    if (!target) return;
    // If there is no key for this sourceNode yet; add it with a value of an empty array.
    if (!adjacencyList[source]) adjacencyList[source] = [];

    if (!adjacencyList[target]) adjacencyList[target] = [];

    // Push the sourceNodeId to the targets array.
    adjacencyList[source]?.push(target);
  });

  return adjacencyList;
}

function findAllPathsToLeaves({
  adjacencyList,
  visited,
  startNode,
  path,
  paths,
  filterFn,
}: {
  adjacencyList: Record<TNodeId, TNodeId[]>;
  startNode: TNodeId;
  visited: Record<string, boolean>;
  paths: TNodeId[][];
  path: TNodeId[];
  filterFn: (id: TNodeId) => boolean;
}) {
  // Mark the current node as visited and add it to the current path
  visited[startNode] = true;
  if (filterFn(startNode)) {
    path.push(startNode);
  }

  const startNodeAdjacencyList = adjacencyList[startNode];

  // Check if the current node is a leaf node
  if (!startNodeAdjacencyList || startNodeAdjacencyList.length === 0) {
    paths.push([...path]);
  } else {
    // Recur for all vertices adjacent to the current vertex
    for (const neighbor of startNodeAdjacencyList) {
      if (!visited[neighbor]) {
        findAllPathsToLeaves({
          adjacencyList,
          startNode: neighbor,
          visited,
          paths,
          path,
          filterFn,
        });
      }
    }
  }

  // Remove the current node from the path and mark it as not visited
  path.pop();
  visited[startNode] = false;

  return paths;
}

export const getPathsFrom =
  (tree: TTree) =>
  (startNode: TNodeId, filterFn: (nodeId: TNodeId) => boolean) => {
    const adjacencyList = createAdjacencyList(Object.values(tree.edges ?? {}));
    const visited: Record<string, boolean> = {};
    const result: TNodeId[][] = [];
    const path: TNodeId[] = [];

    const paths = findAllPathsToLeaves({
      adjacencyList,
      path,
      paths: result,
      startNode,
      visited,
      filterFn,
    });

    return paths;
  };

function longestPathInDAG(
  graph: Record<string, string[]>,
  startVertex: string,
  filterFunction: (nodeId: string) => boolean,
): number {
  const visited: { [key: string]: boolean } = {};
  const stack: string[] = [];
  const distances: { [key: string]: number } = {};

  for (const vertex in graph) {
    visited[vertex] = false;
    distances[vertex] = Number.NEGATIVE_INFINITY;
  }

  distances[startVertex] = filterFunction(startVertex) ? 1 : 0;

  // Function to perform topological sort
  function topologicalSort(v: string) {
    visited[v] = true;
    graph[v]?.forEach((adjacent) => {
      if (!visited[adjacent]) {
        topologicalSort(adjacent);
      }
    });
    stack.push(v);
  }

  // Perform topological Sort
  for (const vertex in graph) {
    if (!visited[vertex]) {
      topologicalSort(vertex);
    }
  }

  // Relaxation in topological order
  while (stack.length > 0) {
    const u = stack.pop();
    if (u && distances[u] !== Number.NEGATIVE_INFINITY && graph[u]) {
      graph[u]?.forEach((adjacent) => {
        const weight = filterFunction(adjacent) ? 1 : 0;

        const newDistance = (distances[u] ?? 0) + weight;
        if ((distances[adjacent] ?? 0) < newDistance) {
          distances[adjacent] = newDistance;
        }
      });
    }
  }

  // Finding the maximum distance
  return Math.max(...Object.values(distances));
}

export const getLongestPath =
  (tree: TTree) =>
  (startNode: TNodeId, filterFn: (nodeId: TNodeId) => boolean) => {
    const adjacencyList = createAdjacencyList(Object.values(tree.edges ?? {}));

    return longestPathInDAG(adjacencyList, startNode, filterFn as any);
  };
