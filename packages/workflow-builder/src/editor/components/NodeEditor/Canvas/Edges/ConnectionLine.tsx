import {
  type ConnectionLineComponentProps,
  getSmoothStepPath,
} from "@xyflow/react";
export function ConnectionLine(props: ConnectionLineComponentProps) {
  const path = getSmoothStepPath({
    sourceX: props.fromX,
    sourceY: props.fromY,
    sourcePosition: props.fromPosition,
    targetX: props.toX,
    targetY: props.toY,
    targetPosition: props.toPosition,
  });

  return (
    <g>
      <path
        fill="none"
        strokeWidth={1.5}
        className="stroke-primary7"
        strokeDasharray={5}
        d={path[0]}
      />
      <circle
        cx={props.toX}
        cy={props.toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}
