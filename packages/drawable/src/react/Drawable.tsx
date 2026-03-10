// drawing/konva/Drawable.tsx

import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";

import type { DrawingEngine, ToolContext } from "..";
import { useScene, TwoPointLine, FreeFormLine, Label } from "./";

import { undoRedoShortcut } from "./keyShortcuts";

interface Props {
  engine: DrawingEngine;
  width: number;
  height: number;
}

// this component binds engine and tools to Konva.
export const Drawable: React.FC<Props> = ({ engine, width, height }) => {
  const state = useScene(engine);

  const stageRef = useRef<Konva.Stage>(null);
  const staticLayerRef = useRef<Konva.Layer>(null);
  const inProgressLayerRef = useRef<Konva.Layer>(null);
  const groupRef = useRef<Konva.Group>(null);

  const toolRef = useRef<ReturnType<DrawingEngine["getTool"]> | null>(null);

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

  useEffect(() => {
    const keyShortcut = undoRedoShortcut(engine);
    window.addEventListener("keydown", keyShortcut);

    const redraw = () => {
      if (!groupRef) return;

      const group = groupRef.current;
      const { inProgressObject } = engine.getTransientSnapshot();

      // clear previous renders
      if (!group) return;
      group.destroyChildren(); // TODO: is slightly more efficient to mutate nodes instead of destroying.

      // imperatively create objects
      if (!inProgressObject) return;
      engine.getTool().renderPreview?.(group, inProgressObject, ctx);

      // render
      inProgressLayerRef.current?.batchDraw();
    };

    // On inProgressObject (transient) changes -> imperatively redraw.
    const unsubscribe = engine.subscribeTransient(redraw);

    return () => {
      window.removeEventListener("keydown", keyShortcut);
      unsubscribe();
    };
  }, [ctx, engine]);

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    toolRef.current = engine.getTool();
    toolRef.current?.onPointerDown?.(e.evt, ctx);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    toolRef.current?.onPointerMove?.(e.evt, ctx);
  };

  const handlePointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
    toolRef.current?.onPointerUp?.(e.evt, ctx);
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
      <Layer ref={staticLayerRef} listening={false}>
        {/* Committed objects */}
        {Object.values(state.objects).map((object) => {
          switch (object.type) {
            case "freeFormLine":
              return <FreeFormLine key={object.id} model={object} />;
            case "twoPointLine":
              return <TwoPointLine key={object.id} model={object} />;
            default:
              console.error(
                "Object found that isn't a registered type",
                object,
              );
          }
        })}

        {Object.values(state.objects).map((object) => {
          if ("area" in object)
            return (
              <Label
                key={object.id}
                object={object}
                value={(obj) => `${obj.area}`}
              />
            );
        })}
      </Layer>

      <Layer ref={inProgressLayerRef}>
        {/* imperative render */}
        <Group ref={groupRef} visible={true} />
      </Layer>
    </Stage>
  );
};
