import { addEdgeVersionProperty } from "./edgeMigrations/addVersionProperty";
import { cleanupEdge } from "./edgeMigrations/cleanupEdge";

export const edgeMigrations = [addEdgeVersionProperty, cleanupEdge];
