import type { TCoordinates } from "../../tree/type/type-classes/Node";
import { nodeHeight, nodeWidth } from "./constants";

export function calculateCenterOfNode(
  position: TCoordinates,
  transform: TCoordinates = { x: 0, y: 0 },
) {
  return {
    x: position.x + nodeWidth / 2 + transform.x,
    y: position.y + nodeHeight / 2 + transform.y,
  };
}
