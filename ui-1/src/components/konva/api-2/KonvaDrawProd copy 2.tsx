// drawing/konva/KonvaDrawingCanvas.tsx

import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";

import { type DrawingEngine } from "@/components/konva/module/core/types";
import {
  useScene,
  TwoPointLine,
  FreeFormLine,
} from "@/components/konva/module";
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
  const state = useScene(engine);

  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const inProgressObject = engine.getInProgressObject();

  useEffect(() => {
    // subscribe to any changes to inProgressObject.
    const unsubscribe = engine.subscribeTransient(() => {
      // how to do a redraw?
      console.log("redrawn!");
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
              return <FreeFormLine key={object.id} model={object} />;
            case "twoPointLine":
              return <TwoPointLine key={object.id} model={object} />;
            default:
              console.log("default", object);
          }
        })}

        <FreeFormLine model={inProgressObject} />
        <TwoPointLine model={inProgressObject} />
      </Layer>
    </Stage>
  );
};
