import { useState, useRef } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import Konva from "konva";

const Drawable = ({
  className = "",
  width = 300,
  height = 300,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  const [lines, setLines] = useState<number[][]>([]);
  const [curLine, setCurLine] = useState<number[]>([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const point = e.target.getStage()?.getPointerPosition();
    if (!point) return;

    setCurLine([...curLine, point.x, point.y]);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    setCurLine([...curLine, point.x, point.y]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setLines([...lines, [...curLine]]);
    setCurLine([]);
  };

  return (
    <Stage
      className={`z-100 ` + className}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <Layer>
        <Text text="Just start drawing" x={5} y={30} />
        <Line
          points={curLine}
          stroke="#df4b26"
          strokeWidth={3}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />

        {lines.map((line, i) => (
          <Line
            key={i}
            points={line}
            stroke="#df4b26"
            strokeWidth={3}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Drawable;
