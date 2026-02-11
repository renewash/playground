import { useRef } from "react";
import Konva from "konva";
import useFreeDraw from "@/components/konva/useFreeDraw";
import { Stage } from "react-konva";
import KonvaFreeDraw from "./KonvaFreeDraw";

const KonvaDrawable = ({
  className = "",
  width = 300,
  height = 300,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  useFreeDraw(stageRef);

  return (
    <div className={className + ` z-100`} ref={containerRef}>
      <Stage ref={stageRef} width={width} height={height}>
        <KonvaFreeDraw />
      </Stage>
    </div>
  );
};

export default KonvaDrawable;
