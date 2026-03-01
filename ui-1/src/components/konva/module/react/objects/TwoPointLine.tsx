import { Circle, Line } from "react-konva";
import { type TwoPointLineModel } from "../../core/types";

export const TwoPointLine = ({
  model,
}: {
  model: TwoPointLineModel | null;
}) => {
  console.log("i am drawing 2 point line");
  if (!model) return;
  const { start, end, radius } = model;
  return (
    <>
      <Line
        points={[...start, ...end]}
        stroke="red"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      />
      <Circle x={start[0]} y={start[1]} radius={radius} />
      <Circle x={end[0]} y={end[1]} radius={radius} />
    </>
  );
};
