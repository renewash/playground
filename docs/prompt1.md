I am developing a drawing module called drawable that allows users to draw lines, polygons, etc. it has the follow engineering features:

1. Framework agnostic
2. Can be library agnostic
3. Scalable and extensible
4. Relatively optimized
5. Predictable, maintainable and debuggable

it has:

- Single source of truth lives in engine
- UI → reads state
- Canvas → renders state
- Tools → mutate via engine API

I try to follow good engineering design. My goal is that it to have an amazing code and engineering design. I will show you the entire project file structure and important code.

src
┣ core
┃ ┣ engine.ts
┃ ┣ history.ts
┃ ┣ measure.ts
┃ ┗ types.ts
┣ geometry
┃ ┣ domain
┃ ┃ ┣ CircleModel.ts
┃ ┃ ┣ FreeDrawModel.ts
┃ ┃ ┣ LineModel.ts
┃ ┃ ┣ LineSegmentModel.ts
┃ ┃ ┗ PolygonSegment.ts
┃ ┣ calculate.ts
┃ ┣ normalise.ts
┃ ┗ types.ts
┣ react
┃ ┣ context
┃ ┃ ┣ KonvaProvider.tsx
┃ ┃ ┗ context.ts
┃ ┣ helpers
┃ ┃ ┣ keyShortcuts.ts
┃ ┃ ┗ sync.ts
┃ ┣ objects
┃ ┃ ┣ Label.tsx
┃ ┃ ┣ Line.tsx
┃ ┃ ┣ LineSegment.tsx
┃ ┃ ┗ PolygonSegment.tsx
┃ ┣ Drawable.tsx
┃ ┗ index.ts
┣ tests
┃ ┣ calculations.test.ts
┃ ┣ editor.test.ts
┃ ┣ engine.test.ts
┃ ┣ tools.test.tsx
┃ ┗ vitest.setup.ts
┣ tools
┃ ┣ freeDrawTool.ts
┃ ┣ lineSegmentTool.ts
┃ ┣ polygonSegmentTool.ts
┃ ┗ types.ts
┣ .DS_Store
┣ constants.ts
┣ index.ts
┣ types.ts
┗ utils.ts

code:

```js
// drawing/core/engine.ts

import { getArea, getLength } from "./measure";
import History, { AddObjectCommand, DeleteObjectCommand } from "./history";

import type {
  Listener,
  DrawingState,
  DrawingEngine,
  EditorState,
  TransientSnapshot,
  ToolType,
  ToolSet,
} from "./types";

import { DrawableObject } from "../geometry/types";

import { createLineSegmentModel } from "../geometry/domain/LineSegmentModel";
import { createFreeDrawModel } from "../geometry/domain/FreeDrawModel";
import { createPolygonSegmentModel } from "../geometry/domain/PolygonSegment";

import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";
import { createPolygonSegmentTool } from "../tools/polygonSegmentTool";

import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../constants";

// Architecture
// Engine (single source of truth and mutations)
// ├── Tools (handle user input and call engine APIs)
// ├── Geometry (models + calculations)
// ├── History (undo/redo)
// └── UI (renderer, e.g. React/Konva)

// Concepts

// Transient state (`inProgressObject`)
// Mutable, used during drawing

// Committed state (`objects`)
// Immutable snapshots stored in history

// Unidirectional flow:
// Tool → Engine → State → UI

interface CreateDrawingEngineOptions {
  initialState?: Partial<DrawingState>;
  initialTool?: ToolType;
  editable?: boolean;
}

/**
 * Holds internal state of canvas and defines mutation logic.
 * This engine manages objects and drawings.
 * Objects are primatives (a single Konva shape) or composites shapes (multiple primatives) represented as a graph.
 * Transient objects holds the state of a drawing that is in progress, such as a line being drawn.
 *
 * @param initial - Optional starting state for the engine.
 * @returns A fresh DrawingEngine instance.
 */
export function createDrawingEngine({
  initialState = {},
  initialTool = "lineSegment",
  editable = true,
}: CreateDrawingEngineOptions = {}): DrawingEngine {
  let state: DrawingState = {
    objects: {},
    childToParentMap: {},
    ...initialState,
  };

  // TODO: fix design so tools are registered outside of the engine and this fallback is not necessary
  const toolSet: Partial<ToolSet> = {
    freeDraw: createFreeDrawTool(),
    lineSegment: createLineSegmentTool(),
    polygonSegment: createPolygonSegmentTool(),
  };

  let editorState: EditorState = {
    mode: "idle",
    tool: toolSet[initialTool] || createLineSegmentTool(),
    style: {
      strokeWidth: STROKE_WIDTH_DEFAULT,
      strokeColor: STROKE_COLOR_DEFAULT,
    },
    editable,
  };

  const history = new History();

  let inProgressUpdates: number = 0;
  let inProgressObject: DrawableObject | null = null;

  let transientSnapshot: TransientSnapshot = {
    version: inProgressUpdates,
    inProgressObject,
  };

  const listeners = new Set<Listener>();
  const editorListeners = new Set<Listener>();
  const transientListeners = new Set<Listener>();

  const emit = () => listeners.forEach((l) => l());
  const emitEditorUpdate = () => editorListeners.forEach((l) => l());
  const emitInProgressUpdates = () => {
    inProgressUpdates++;

    transientSnapshot = { version: inProgressUpdates, inProgressObject };
    transientListeners.forEach((l) => l());
  };

  return {
    getState() {
      return state;
    },

    getEditorState() {
      return editorState;
    },

    setStrokeColor(color) {
      editorState = {
        ...editorState,
        style: {
          ...editorState.style,
          strokeColor: color,
        },
      };
      emitEditorUpdate();
    },

    setStrokeWidth(width) {
      editorState = {
        ...editorState,
        style: {
          ...editorState.style,
          strokeWidth: width,
        },
      };
      emitEditorUpdate();
    },

    setEditable(editable) {
      editorState = {
        ...editorState,
        editable,
      };
      emitEditorUpdate();
    },

    toggleEditable() {
      editorState = {
        ...editorState,
        editable: !editorState.editable,
      };
      emitEditorUpdate();
    },

    getTool() {
      return editorState.tool;
    },

    pickTool(toolName) {
      const tool = toolName as keyof typeof toolSet;
      // TODO: fix design so this fallback is not necessary
      this.setTool(toolSet[tool] ?? createLineSegmentTool());
    },

    setTool(tool) {
      editorState = {
        ...editorState,
        tool,
      };
      emitEditorUpdate();
    },

    _startDrawing() {
      editorState = {
        ...editorState,
        mode: "drawing",
      };
      emitEditorUpdate();
    },

    _stopDrawing() {
      editorState = {
        ...editorState,
        mode: "idle",
      };
      emitEditorUpdate();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    subscribeEditor(listener) {
      editorListeners.add(listener);
      return () => editorListeners.delete(listener);
    },

    subscribeTransient(listener) {
      transientListeners.add(listener);
      return () => transientListeners.delete(listener);
    },

    getInProgressObject() {
      return inProgressObject;
    },

    getTransientSnapshot() {
      return transientSnapshot;
    },

    getCommittedObjects() {
      return state.objects;
    },

    getParentId(nodeId) {
      if (nodeId in state.childToParentMap === false) {
        return null;
      }

      return state.childToParentMap[nodeId] ?? null;
    },

    getNode(nodeId) {
      if (nodeId in state.objects === false) {
        return null;
      }
      return state.objects[nodeId] ?? null;
    },

    createLineSegment(start, radius) {
      inProgressObject = createLineSegmentModel({
        start,
        radius,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    endLineSegment(point, radius) {
      if (inProgressObject === null || inProgressObject.type !== "lineSegment")
        return;

      inProgressObject.end = point;
      inProgressObject.radius = inProgressObject.radius ?? radius;

      inProgressObject.length = getLength(inProgressObject);

      emitInProgressUpdates();
    },

    createFreeFormLine(points) {
      inProgressObject = createFreeDrawModel({
        points,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    appendPointToFreeFormLine(point) {
      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;

      inProgressObject.points.push(point);
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    setFreeFormLine(points) {
      if (!inProgressObject || inProgressObject.type !== "freeDraw") return;

      inProgressObject.points = points;
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    createPolygonSegment(points, radius) {
      inProgressObject = createPolygonSegmentModel({
        points,
        radius,
        style: editorState.style,
      });

      this._startDrawing();
      emitInProgressUpdates();
    },

    appendPointToPolygonSegment(point) {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      inProgressObject.points.push(point);
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    setPolygonSegment(points, radius) {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      inProgressObject.points = points;
      inProgressObject.radius = inProgressObject.radius ?? radius;
      inProgressObject.area = getArea(inProgressObject);

      emitInProgressUpdates();
    },

    replaceLastPointOfPolygonSegment(point) {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      const n = inProgressObject.points.length;
      if (n < 2) return;

      inProgressObject.points[n - 1] = point;
      inProgressObject.area = getArea(inProgressObject);
      emitInProgressUpdates();
    },

    removeLastPointOfPolygonSegment() {
      if (!inProgressObject || inProgressObject.type !== "polygonSegment")
        return;

      const n = inProgressObject.points.length;
      if (n < 2) return;

      inProgressObject.points.pop();
      inProgressObject.area = getArea(inProgressObject);
      emitInProgressUpdates();
    },

    commitObject() {
      if (!inProgressObject) return;

      // Deep clone inProgressObject, reduces risks of mutations to commited objects
      // ensuring history commands have immutable state
      const clone = structuredClone(inProgressObject);
      history.execute(new AddObjectCommand(clone), this);
      emit();

      inProgressObject = null;
      this._stopDrawing();

      emitInProgressUpdates();
    },

    deleteObjectById(id) {
      const node = this.getNode(id);
      if (!node) {
        console.warn(`Attempting to delete non existent node with id ${id}`);
        return;
      }

      history.execute(new DeleteObjectCommand(node), this);
      emit();
    },

    cancelDrawing() {
      inProgressObject = null;
      this._stopDrawing();
      emitInProgressUpdates();
    },

    _addObject(object) {
      if (!object) {
        console.warn("Attempting to add null object");
        return;
      }

      const { id } = object;

      if ("area" in object) {
        object.area = getArea(object);
      }
      if ("length" in object) {
        object.length = getLength(object);
      }

      state = {
        ...state,
        objects: { ...state.objects, [id]: object },
        childToParentMap: { ...state.childToParentMap, [id]: null },
      };
    },

    _removeObject(id) {
      const newObjects = { ...state.objects };
      delete newObjects[id];

      const newChildToParentMap = { ...state.childToParentMap };
      delete newChildToParentMap[id];

      state = {
        ...state,
        objects: newObjects,
        childToParentMap: newChildToParentMap,
      };
    },

    undo() {
      history.undo(this);
      emit();
    },

    redo() {
      history.redo(this);
      emit();
    },

    clear() {
      state = {
        ...state,
        objects: {},
        childToParentMap: {},
      };
      emit();

      inProgressObject = null;
      emitInProgressUpdates();
    },

    getSerializedState() {
      return JSON.stringify(state);
    },

    setSerializedState(serializedState) {
      try {
        const parsedState = JSON.parse(serializedState);
        state = {
          ...state,
          ...parsedState,
        };
        emit();
      } catch (e) {
        console.error("Failed to parse serialized state:", e);
      }
    },
  };
}


// drawing/core/history.ts

import { DrawableObject } from "../geometry/types";
import { DrawingEngine } from "./types";

export interface Command {
  do(engine: DrawingEngine): void;
  undo(engine: DrawingEngine): void;
}

export class AddObjectCommand implements Command {
  // Object state should be immutable to ensure that undo/redo works correctly
  constructor(private object: Readonly<DrawableObject>) {}

  undo(engine: DrawingEngine) {
    engine._removeObject(this.object.id);
  }

  do(engine: DrawingEngine) {
    engine._addObject(this.object);
  }
}

export class DeleteObjectCommand implements Command {
  constructor(private object: Readonly<DrawableObject>) {}

  undo(engine: DrawingEngine) {
    engine._addObject(this.object);
  }

  do(engine: DrawingEngine) {
    engine._removeObject(this.object.id);
  }
}

export default class History {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command, engine: DrawingEngine) {
    command.do(engine);
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo(engine: DrawingEngine) {
    const command = this.undoStack.pop();
    if (!command) return;
    command.undo(engine);
    this.redoStack.push(command);
  }

  redo(engine: DrawingEngine) {
    const command = this.redoStack.pop();
    if (!command) return;

    command.do(engine);
    this.undoStack.push(command);
  }
}


e.g. of a domain model

import { calculateArea } from "../calculate";
import type { FreeDrawModel, Points, ShapeStyle } from "../types";
import { STROKE_COLOR_DEFAULT, STROKE_WIDTH_DEFAULT } from "../../constants";
interface CreateFreeDrawModel {
  points: Points;
  style?: ShapeStyle;
}

export const createFreeDrawModel = ({
  points,
  style = {
    strokeWidth: STROKE_WIDTH_DEFAULT,
    strokeColor: STROKE_COLOR_DEFAULT,
  },
}: CreateFreeDrawModel): FreeDrawModel => {
  const area = calculateArea(points);
  return {
    id: crypto.randomUUID(),
    type: "freeDraw",
    points,
    area,
    style,
  };
};


E.g. of tool

// drawing/tools/freeDrawTool.ts

import Konva from "konva";
import { type DrawingTool } from "./types";
import { deriveLabelPosition } from "../core/measure";
import { LABEL_FONT_SIZE_DEFAULT, LABEL_PADDING_DEFAULT } from "../constants";

export function createFreeDrawTool(): DrawingTool {
  // free draw tool doesn't require DOM event e, thus we can ignore it with _
  return {
    type: "freeDraw",
    onPointerDown(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      const { x, y } = pos;
      ctx.engine.createFreeFormLine([{ x, y }]);
    },

    onPointerMove(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      const { x, y } = pos;
      ctx.engine.appendPointToFreeFormLine({ x, y });
    },

    onPointerUp(_, ctx) {
      const pos = ctx.getPointerPosition();
      if (!pos) return;
      const { x, y } = pos;

      ctx.engine.appendPointToFreeFormLine({ x, y });
      ctx.engine.commitObject();
    },

    renderPreview(group, obj, ctx) {
      // TODO: use ctx to allow labels to be boundary aware

      if (obj.type !== "freeDraw") return;

      const { x, y } = deriveLabelPosition(obj);
      const value = String(obj["area"]);

      const label = new Konva.Label({ x, y });
      const tag = new Konva.Tag({ opacity: 1 });
      const text = new Konva.Text({
        text: value,
        fontSize: LABEL_FONT_SIZE_DEFAULT,
        padding: LABEL_PADDING_DEFAULT,
      });

      label.add(tag);
      label.add(text);

      const { style } = ctx.engine.getEditorState();
      const strokeColor = style.strokeColor || "black";
      const strokeWidth = style.strokeWidth || 0.002;

      const line = new Konva.Line({
        points: obj.points.flatMap((point) => [point.x, point.y]),
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        lineCap: "round",
        lineJoin: "round",
      });
      group.add(label);
      group.add(line);
    },
  };
}


react bindings

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

        {Object.values(state.objects).map((object) => {
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

// drawing/react/sync.ts

import { useSyncExternalStore } from "react";
import type {
  DrawingState,
  DrawingEngine,
  EditorState,
  AllEngineShapes,
} from "../../core/types";
import type { DrawableObject } from "../../geometry/types";

export const useScene = (engine: DrawingEngine): DrawingState => {
  return useSyncExternalStore(
    engine.subscribe,
    engine.getState,
    engine.getState,
  );
};

export const useInProgressObject = (
  engine: DrawingEngine,
): DrawableObject | null => {
  const snap = useSyncExternalStore(
    engine.subscribeTransient,
    engine.getTransientSnapshot,
    engine.getTransientSnapshot,
  );

  return snap.inProgressObject;
};

export const useAllEngineShapes = (engine: DrawingEngine): AllEngineShapes => {
  return useSyncExternalStore(engine.subscribe, () => ({
    committedObjects: engine.getState(),
    inProgressObject: engine.getTransientSnapshot().inProgressObject,
  }));
};

export const useEditor = (engine: DrawingEngine): EditorState => {
  return useSyncExternalStore(
    engine.subscribeEditor,
    engine.getEditorState,
    engine.getEditorState,
  );
};
```

Rate the design of this code. Talk about the good and the bad and what can be improved.
