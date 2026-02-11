import useDrawingStore from "./drawingStore";
import { Layer, Line } from "react-konva";

const KonvaFreeDraw = () => {
  const { currentStroke, draftStrokes } = useDrawingStore();
  return (
    <Layer>
      {draftStrokes.map((stroke, index) => (
        <Line
          key={index}
          points={stroke}
          stroke="red"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      ))}
      {currentStroke && (
        <Line
          points={currentStroke}
          stroke="blue"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      )}
    </Layer>
  );
};

export default KonvaFreeDraw;
