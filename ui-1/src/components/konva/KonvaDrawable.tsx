import { useRef } from "react";
import { Layer } from "react-konva";

import useFreeDraw from "@/components/konva/useFreeDraw";
import { Stage } from "react-konva";
import KonvaFreeDraw from "./KonvaFreeDraw";
import KonvaStatic from "./KonvaStatic";
import KonvaDraft from "./KonvaDraft";

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
  const { start, move, end } = useFreeDraw();

  return (
    <div className={className + ` z-100`} ref={containerRef}>
      <Stage
        width={width}
        height={height}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
      >
        <Layer>
          <KonvaFreeDraw />
        </Layer>
        <Layer listening={false}>
          <KonvaDraft />
        </Layer>

        <Layer listening={false}>
          <KonvaStatic />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaDrawable;
