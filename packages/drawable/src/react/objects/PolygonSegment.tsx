import { Circle, Line } from "react-konva";
import type { DrawableObject, PolygonSegmentModel } from "../../geometry/types";

const PolygonSegment = ({
  model,
}: {
  model: DrawableObject | PolygonSegmentModel | null;
}) => {
  if (!model || model.type !== "polygonSegment") return null;

  const { radius } = model;
  const { strokeColor, strokeWidth } = model.style;

  return (
    <>
      <Line
        points={model.points.flatMap((point) => [point.x, point.y])}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
        closed={true}
      />
      {model.points.map((point) => (
        <Circle
          key={`${point.x}-${point.y}`}
          x={point.x}
          y={point.y}
          radius={radius}
          stroke={strokeColor}
        />
      ))}
    </>
  );
};

export default PolygonSegment;
