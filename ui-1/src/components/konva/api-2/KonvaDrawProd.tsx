// drawing/konva/KonvaDrawingCanvas.tsx

import React, { useEffect, useMemo, useRef } from "react";
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

// this component binds engine and tools to Konva.
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

  // subscribe to any changes is engine state.
  useEffect(() => {
    const unsubscribe = engine.subscribe(() => {
      const activeStroke = engine.getActiveStroke();
      if (!activeStroke || !activeLineRef.current) return;
      activeLineRef.current.points(activeStroke.points);
      layerRef.current?.batchDraw();
    });

    return unsubscribe;
  }, [engine]);

  // bind react with tool and engine via context object
  const ctx: ToolContext = useMemo(
    () => ({
      engine,
      getPointerPosition() {
        return stageRef.current?.getPointerPosition() ?? null;
      },
    }),
    [engine],
  );

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    tool.onPointerDown?.(e.evt, ctx);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    tool.onPointerMove?.(e.evt, ctx);
  };

  const handlePointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
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
