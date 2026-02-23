// drawing/konva/KonvaDrawingCanvas.tsx

import React, { useMemo, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";

import { type DrawingEngine } from "@/components/konva/module/core/engine";
import { useDrawing } from "@/components/konva/module/react/useDrawing";
import {
  type DrawingTool,
  type ToolContext,
} from "@/components/konva/module/tools/types";

interface Props {
  engine: DrawingEngine;
  tool: DrawingTool;
  width: number;
  height: number;
}

export const KonvaDrawingCanvas: React.FC<Props> = ({
  engine,
  tool,
  width,
  height,
}) => {
  const state = useDrawing(engine);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const activeLineRef = useRef<Konva.Line>(null);

  const ctx: ToolContext = useMemo(
    () => ({
      engine,
      getPointerPosition() {
        return stageRef.current?.getPointerPosition() ?? null;
      },
    }),
    [engine],
  );

  const handlePointerDown = (e: any) => {
    tool.onPointerDown?.(e.evt, ctx);
  };

  const handlePointerMove = (e: any) => {
    if (state.mode !== "drawing") return;

    const pos = ctx.getPointerPosition();
    if (!pos || !activeLineRef.current) return;

    // Imperative hot-path update
    const pts = activeLineRef.current.points();
    activeLineRef.current.points([...pts, pos.x, pos.y]);

    layerRef.current?.batchDraw();

    tool.onPointerMove?.(e.evt, ctx);
  };

  const handlePointerUp = (e: any) => {
    tool.onPointerUp?.(e.evt, ctx);
  };

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
    >
      <Layer ref={layerRef}>
        {/* Committed strokes */}
        {state.strokes.map((stroke) => (
          <Line
            key={stroke.id}
            points={stroke.points}
            stroke="black"
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        ))}

        {/* Active stroke (imperative) */}
        {state.activeStroke && (
          <Line
            ref={activeLineRef}
            points={state.activeStroke.points}
            stroke="red"
            strokeWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </Layer>
    </Stage>
  );
};
