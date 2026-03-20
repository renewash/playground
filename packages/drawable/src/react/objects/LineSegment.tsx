// drawing/react/objects/LineSegment.tsx

import { Circle, Line } from "react-konva";
import type { DrawableObject, LineSegmentModel } from "../../geometry/types";

export const LineSegment = ({
  model,
}: {
  model: DrawableObject | LineSegmentModel | null;
}) => {
  if (!model || model.type !== "lineSegment") return null;
  const { start, end, radius, style } = model;
  console.log("model", model);
  return (
    <>
      <Line
        points={[start.x, start.y, end.x, end.y]}
        strokeWidth={style.strokeWidth}
        stroke={style.strokeColor}
        lineCap="round"
        lineJoin="round"
      />
      <Circle
        x={start.x}
        y={start.y}
        radius={radius}
        strokeWidth={style.strokeWidth}
        stroke={style.strokeColor}
      />
      <Circle
        x={end.x}
        y={end.y}
        radius={radius}
        strokeWidth={style.strokeWidth}
        stroke={style.strokeColor}
      />
    </>
  );
};
