import { useRef } from "react";
import { Layer } from "react-konva";

import { useFreeDraw, useKonvaContext } from "@/components/konva/module";

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
  const { store, drawingState } = useKonvaContext();
  const { start, move, end } = useFreeDraw(store);

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
          <KonvaCurrentShape stroke={drawingState.activeStroke} />
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
