import { describe, expect, it } from "vitest";
import { createDrawingEngine } from "../core/engine";

import { createLineSegmentModel } from "../geometry/domain/LineSegmentModel";
import { createFreeDrawModel } from "../geometry/domain/FreeDrawModel";

describe("DrawingEngine", () => {
  it("initializes with default state", () => {
    const engine = createDrawingEngine();
    const state = engine.getState();
    expect(state).toHaveProperty("objects");
    expect(state.objects).toEqual({});
  });

  it("adds an object to the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    });

    engine._addObject(line);
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[line.id]).toEqual(line);
  });

  it("deletes an object from the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    });

    engine._addObject(line);
    engine.deleteObjectById(line.id);
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("undo and redo an action", () => {
    const engine = createDrawingEngine();

    engine.createFreeFormLine([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 20, y: 13 },
    ]);
    engine.commitObject();
    engine.undo();
    let state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);

    engine.redo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    // expect(state.objects[line.id]).toEqual(line);
  });
});

describe("DrawingEngine - Edge Cases", () => {
  it("undo with no actions", () => {
    const engine = createDrawingEngine();
    expect(() => engine.undo()).not.toThrow();
  });

  it("redo with no undone actions", () => {
    const engine = createDrawingEngine();
    expect(() => engine.redo()).not.toThrow();
  });

  it("delete non-existent object", () => {
    const engine = createDrawingEngine();
    expect(() => engine.deleteObjectById("non-existent-id")).not.toThrow();
  });
});

describe("DrawingEngine - Complex Scenarios", () => {
  it("multiple actions and undos/redos", () => {
    const engine = createDrawingEngine();
    engine.createLineSegment({ x: 0, y: 0 });
    engine.endLineSegment({ x: 1, y: 1 });
    const lineSegment1 = engine.getInProgressObject();
    engine.commitObject();

    engine.createFreeFormLine([
      { x: 0, y: 0 },
      { x: 0.5, y: 0.5 },
      { x: 1, y: 1 },
    ]);
    const freeDraw1 = engine.getInProgressObject();
    engine.commitObject();

    if (!lineSegment1 || !freeDraw1) {
      throw new Error("In-progress objects should be defined");
    }

    let state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(2);

    engine.undo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[lineSegment1.id]).toEqual(lineSegment1);

    engine.undo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);

    engine.redo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[lineSegment1.id]).toEqual(lineSegment1);

    engine.redo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(2);
    expect(state.objects[lineSegment1.id]).toEqual(lineSegment1);
    expect(state.objects[freeDraw1.id]).toEqual(freeDraw1);
  });
});

describe("DrawingEngine - State", () => {
  it("clears the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    });

    engine._addObject(line);
    engine.clear();

    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("serializes and deserializes state correctly", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    });
    engine._addObject(line);

    const serializedState = engine.getSerializedState();
    const deserializedState = JSON.parse(serializedState);

    expect(deserializedState).toHaveProperty("objects");
    expect(deserializedState.objects[line.id]).toEqual(line);
  });
});
