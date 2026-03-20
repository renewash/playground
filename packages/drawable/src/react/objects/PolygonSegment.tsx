import { Circle, Line } from "react-konva";
import type { DrawableObject, PolygonSegmentModel } from "../../geometry/types";

const PolygonSegment = ({
  model,
}: {
  model: DrawableObject | PolygonSegmentModel | null;
}) => {
  if (!model || model.type !== "polygonSegment") return null;

  const { radius, points } = model;
  const { strokeColor, strokeWidth } = model.style;

  return (
    <>
      <Line
        points={points.flatMap((point) => [point.x, point.y])}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
        closed={true}
      />
      {points.map((point) => (
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
