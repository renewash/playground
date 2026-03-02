// drawing/react/objects/TwoPointLine.tsx

import { Circle, Line } from "react-konva";
import type { DrawableObject, TwoPointLineModel } from "../../core/types";

export const TwoPointLine = ({
  model,
}: {
  model: DrawableObject | TwoPointLineModel | null;
}) => {
  if (!model || model.type !== "twoPointLine") return null;
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
