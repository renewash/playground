// drawing/konva/KonvaDrawingCanvas.tsx

import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";

import type { DrawingEngine, DrawingTool, ToolContext } from "@repo/drawable";
import { useScene, LineSegment, FreeDraw } from "@repo/drawable/react";

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
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    // subscribe to any inProgressObject changes and imperatively redraw.
    const unsubscribe = engine.subscribeTransient(() => {
      if (!groupRef) return;

      const group = groupRef.current;
      const { inProgressObject } = engine.getTransientSnapshot();

      // clear previous renders
      if (!group) return;
      group.destroyChildren(); // TODO: To be slightly more efficient, mutate nodes instead of destroying.

      // imperatively create objects
      if (!inProgressObject) return;
      tool.renderPreview?.(group, inProgressObject);

      // render
      layerRef.current?.batchDraw();
    });

    return unsubscribe;
  }, [engine, tool]);

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
        {/* Committed objects */}
        {Object.values(state.objects).map((object) => {
          // switch
          switch (object.type) {
            case "freeDraw":
              return <FreeDraw key={object.id} model={object} />;
            case "lineSegment":
              return <LineSegment key={object.id} model={object} />;
            default:
              // TODO: create a UnknownObject component that can render something for unknown objects instead of just logging.
              console.error("Unexpected object type", object);
          }
        })}

        {/* imperative render */}
        <Group ref={groupRef} visible={true} />
      </Layer>
    </Stage>
  );
};
