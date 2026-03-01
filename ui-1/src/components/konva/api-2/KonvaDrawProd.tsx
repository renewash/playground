// drawing/konva/KonvaDrawingCanvas.tsx

import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";

import {
  type DrawingEngine,
  type TwoPointLineModel,
} from "@/components/konva/module/core/types";
import { useDrawing, TwoPointLine } from "@/components/konva/module";
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
      const node = activeLineRef.current;
      if (!node) return;

      const obj = engine.getInProgressObject();

      if (!obj) {
        node.visible(false);
      } else if (obj.type === "stroke") {
        node.visible(true);
        node.points(obj.points);
      }

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
        {Object.values(state.objects).map((object) => {
          // switch
          switch (object.type) {
            case "stroke":
              return (
                <Line
                  key={object.id}
                  points={object.points}
                  stroke="black"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            case "twoPointLine":
              return (
                <TwoPointLine
                  key={object.id}
                  model={(state.inProgressObject as TwoPointLineModel) || null}
                />
              );
          }
        })}

        <Line
          ref={activeLineRef}
          points={
            state?.inProgressObject?.type === "stroke"
              ? state?.inProgressObject?.points
              : []
          }
          stroke="red"
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
        />

        <TwoPointLine
          model={
            state?.inProgressObject?.type === "twoPointLine"
              ? state?.inProgressObject
              : null
          }
        />
      </Layer>
    </Stage>
  );
};
