import { describe, expect, it } from "vitest";
import { createDrawingEngine } from "../core/engine";
import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";
import { createPolygonSegmentTool } from "../tools/polygonSegmentTool";
import { DrawingEngine } from "../core/types";
import { DrawingTool } from "../tools/types";
import {
  FreeDrawModel,
  LineSegmentModel,
  PolygonSegmentModel,
} from "../geometry/types";

describe("Tools", () => {
  it("initializes with default tool", () => {
    const engine = createDrawingEngine();
    const editorState = engine.getEditorState();
    expect(editorState.tool).toBeDefined();
    expect(editorState.tool.type).toBe("lineSegment");
  });

  it("use free draw tool", () => {
    const engine = createDrawingEngine();
    const freeDrawTool = createFreeDrawTool();
    engine.setTool(freeDrawTool);
    const editorState = engine.getEditorState();
    expect(editorState.tool).toBe(freeDrawTool);
    expect(editorState.tool.type).toBe("freeDraw");

    const point1 = { x: 100, y: 100 };
    const point2 = { x: 150, y: 150 };
    const point3 = { x: 50, y: 75 };

    mockClickEvent(freeDrawTool, engine, point1);
    mockMoveEvent(freeDrawTool, engine, point2);
    mockPointerUpEvent(freeDrawTool, engine, point3);

    const state = engine.getState();

    const firstEntry = Object.entries(state.objects)[0];
    expect(firstEntry).toBeDefined();

    const object = firstEntry && firstEntry[1];
    const freeDraw = object as FreeDrawModel;

    expect(freeDraw).toBeDefined();
    expect(freeDraw.type).toBe("freeDraw");

    expect(freeDraw.points).toEqual([
      point1.x,
      point1.y,
      point2.x,
      point2.y,
      point3.x,
      point3.y,
    ]);
  });

  it("use line segment tool", () => {
    const engine = createDrawingEngine();
    const lineSegmentTool = createLineSegmentTool();
    engine.setTool(lineSegmentTool);

    const editorState = engine.getEditorState();
    expect(editorState.tool).toBe(lineSegmentTool);
    expect(editorState.tool.type).toBe("lineSegment");

    const point1 = { x: 100, y: 100 };
    const point2 = { x: 150, y: 150 };
    // const point3 = { x: 50, y: 75 };

    mockClickEvent(lineSegmentTool, engine, point1);
    mockClickEvent(lineSegmentTool, engine, point2);

    const state = engine.getState();

    const firstEntry = Object.entries(state.objects)[0];
    expect(firstEntry).toBeDefined();

    const object = firstEntry && firstEntry[1];
    const lineSegment = object as LineSegmentModel;

    expect(lineSegment).toBeDefined();
    expect(lineSegment.type).toBe("lineSegment");

    expect(lineSegment.start).toEqual([point1.x, point1.y]);
    expect(lineSegment.end).toEqual([point2.x, point2.y]);
  });

  it("use polygon segment tool", () => {
    const engine = createDrawingEngine();
    const polygonSegmentTool = createPolygonSegmentTool();
    engine.setTool(polygonSegmentTool);
    const editorState = engine.getEditorState();
    expect(editorState.tool).toBe(polygonSegmentTool);
    expect(editorState.tool.type).toBe("polygonSegment");

    const point1 = { x: 100, y: 100 };
    const point2 = { x: 150, y: 150 };
    const point3 = { x: 50, y: 75 };

    mockClickEvent(polygonSegmentTool, engine, point1);
    mockClickEvent(polygonSegmentTool, engine, point2);
    mockDoubleClickEvent(polygonSegmentTool, engine, point3);

    const state = engine.getState();
    const firstEntry = Object.entries(state.objects)[0];
    expect(firstEntry).toBeDefined();

    const object = firstEntry && firstEntry[1];
    const polygonSegment = object as PolygonSegmentModel;

    expect(polygonSegment).toBeDefined();
    expect(polygonSegment.type).toBe("polygonSegment");

    expect(polygonSegment.points).toEqual([
      point1.x,
      point1.y,
      point2.x,
      point2.y,
      point3.x,
      point3.y,
    ]);
  });
});

// describe("Drawable component", () => {
//   it("renders without crashing", () => {
//     const engine = createDrawingEngine();
//     render(<Drawable engine={engine} width={500} height={500} />);
//   });

// });

const mockClickEvent = (
  tool: DrawingTool,
  engine: DrawingEngine,
  clickEvent: { x: number; y: number },
) => {
  const pointerdown = new PointerEvent("pointerdown", {
    clientX: clickEvent.x,
    clientY: clickEvent.y,
  });

  tool.onPointerDown?.(pointerdown, {
    engine,
    getPointerPosition() {
      return { x: pointerdown.clientX, y: pointerdown.clientY };
    },
  });
};

const mockMoveEvent = (
  tool: DrawingTool,
  engine: DrawingEngine,
  moveEvent: { x: number; y: number },
) => {
  const pointermove = new PointerEvent("pointermove", {
    clientX: moveEvent.x,
    clientY: moveEvent.y,
  });

  tool.onPointerMove?.(pointermove, {
    engine,
    getPointerPosition() {
      return { x: pointermove.clientX, y: pointermove.clientY };
    },
  });
};

const mockPointerUpEvent = (
  tool: DrawingTool,
  engine: DrawingEngine,
  upEvent: { x: number; y: number },
) => {
  const pointerup = new PointerEvent("pointerup", {
    clientX: upEvent.x,
    clientY: upEvent.y,
  });

  tool.onPointerUp?.(pointerup, {
    engine,
    getPointerPosition() {
      return { x: pointerup.clientX, y: pointerup.clientY };
    },
  });
};

const mockDoubleClickEvent = (
  tool: DrawingTool,
  engine: DrawingEngine,
  clickEvent: { x: number; y: number },
) => {
  const dblclick = new PointerEvent("dblclick", {
    clientX: clickEvent.x,
    clientY: clickEvent.y,
  });

  tool.onDoubleClick?.(dblclick, {
    engine,
    getPointerPosition() {
      return { x: dblclick.clientX, y: dblclick.clientY };
    },
  });
};
