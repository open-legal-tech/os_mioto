import { addEdgesProperty } from "./nodeMigrations/addEdgesProperty";
import { addMissingFinalProperty } from "./nodeMigrations/addMissingFinalProperty";
import { addNodeVersionProperty } from "./nodeMigrations/addVersionProperty";

export const nodeMigrations = [
  addNodeVersionProperty,
  addEdgesProperty,
  addMissingFinalProperty,
];
