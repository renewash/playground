import useDrawingStore from "./drawingStore";
import { Line } from "react-konva";

const KonvaFreeDraw = () => {
  const { currentStroke } = useDrawingStore();
  return (
    <>
      {currentStroke && (
        <Line
          points={currentStroke}
          stroke="blue"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />
      )}
    </>
  );
};

export default KonvaFreeDraw;
