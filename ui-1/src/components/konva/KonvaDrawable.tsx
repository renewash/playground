import { useRef } from "react";
import { Layer } from "react-konva";

import useFreeDraw from "@/components/konva/useFreeDraw";
import { Stage } from "react-konva";
import {
  KonvacommittedShapes,
  KonvaCurrentShape,
  KonvaDraftShapes,
} from "./KonvaShapeDisplays";

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
  const { currentStroke, start, move, end, toFlatPoints } = useFreeDraw();
  console.log("toFlatPoints():", toFlatPoints());
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
          <KonvaCurrentShape stroke={currentStroke} />
          <KonvaDraftShapes />
        </Layer>

        <Layer listening={false}>
          <KonvacommittedShapes />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaDrawable;
