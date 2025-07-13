import { type EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { memo } from "react";

export const CustomEdge = memo(
  ({
    id,
    style,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    selected: isSelected,
    source,
    target,
    markerEnd,
  }: EdgeProps) => {
    const d = getSmoothStepPath({
      sourceX,
      sourceY: sourceY - 10,
      sourcePosition,
      targetX,
      targetY: targetY + 7,
      targetPosition,
      borderRadius: 12,
    });

    return (
      <g
        className="react-flow__connection"
        data-test={`${source}_${target}_edge`}
      >
        <path
          key={`${id}_${isSelected}`}
          id={id}
          d={d[0]}
          className="stroke-gray7 fill-none stroke-1"
          style={style}
          markerEnd={markerEnd}
        />
      </g>
    );
  },
);

CustomEdge.displayName = "CustomEdge";
