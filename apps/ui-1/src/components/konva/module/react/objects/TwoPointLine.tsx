// drawing/react/objects/LineSegment.tsx

import { Circle, Line } from "react-konva";
import type { DrawableObject, LineSegmentModel } from "../../core/types";

export const LineSegment = ({
  model,
}: {
  model: DrawableObject | LineSegmentModel | null;
}) => {
  if (!model || model.type !== "lineSegment") return null;
  const { start, end, radius } = model;

  return (
    <>
      <Line
        points={[...start, ...end]}
        stroke="blue"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
      <Circle x={start[0]} y={start[1]} radius={radius} stroke="black" />
      <Circle x={end[0]} y={end[1]} radius={radius} stroke="black" />
    </>
  );
};
