// drawing/react/Drawable.tsx

import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";

import type { DrawingEngine, ToolContext } from "..";
import { useScene, LineSegment, FreeDraw, Label, useEditor } from "./";

import { undoRedoShortcut } from "./helpers/keyShortcuts";
import PolygonSegment from "./objects/PolygonSegment";

interface Props {
  engine: DrawingEngine;
  width: number;
  height: number;
}

// this component binds engine and tools to Konva.
export const Drawable: React.FC<Props> = ({ engine, width, height }) => {
  const state = useScene(engine);
  const editorState = useEditor(engine);

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
        const pos = stageRef.current?.getPointerPosition();
        if (!pos) return null;
        const { x, y } = pos;
        // normalize pointer position to [0, 1] range based on viewport size
        return {
          x: x / width,
          y: y / height,
        };
      },
    }),
    [engine, width, height],
  );

  useEffect(() => {
    const keyShortcut = undoRedoShortcut(engine);
    window.addEventListener("keydown", keyShortcut);

    if (!editorState.editable) {
      toolRef.current = null;
      engine.cancelDrawing();
    }

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
  }, [ctx, editorState.editable, engine]);

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!editorState.editable) {
      toolRef.current = null;
      return;
    }

    toolRef.current = engine.getTool();
    toolRef.current?.onPointerDown?.(e.evt, ctx);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!editorState.editable) {
      toolRef.current = null;
      return;
    }

    toolRef.current?.onPointerMove?.(e.evt, ctx);
  };

  const handlePointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!editorState.editable) {
      toolRef.current = null;
      return;
    }

    toolRef.current?.onPointerUp?.(e.evt, ctx);
  };

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Layer
        scale={{ x: width, y: height }}
        ref={staticLayerRef}
        listening={false}
      >
        {/* Committed objects */}
        {Object.values(state.objects).map((object) => {
          switch (object.type) {
            case "freeDraw":
              return <FreeDraw key={object.id} model={object} />;
            case "lineSegment":
              return <LineSegment key={object.id} model={object} />;
            case "polygonSegment":
              return <PolygonSegment key={object.id} model={object} />;
            default:
              console.error(
                "Object found that isn't a registered type",
                object,
              );
          }
        })}

        {editorState.showLabels &&
          Object.values(state.objects).map((object) => {
            if ("area" in object)
              return (
                <Label
                  key={object.id}
                  model={object}
                  value={(obj) => `${obj.area}`}
                />
              );
          })}
      </Layer>

      <Layer scale={{ x: width, y: height }} ref={inProgressLayerRef}>
        {/* imperative render */}
        <Group ref={groupRef} visible={true} />
      </Layer>
    </Stage>
  );
};
