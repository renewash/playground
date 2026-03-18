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
    const line = createLineSegmentModel({ start: [0, 0], end: [1, 1] });

    engine._addObject(line);
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[line.id]).toEqual(line);
  });

  it("deletes an object from the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({ start: [0, 0], end: [1, 1] });

    engine._addObject(line);
    engine.deleteObjectById(line.id);
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("undoes an action", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({ start: [0, 0], end: [1, 1] });

    engine._addObject(line);
    engine.undo();
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("redoes an action", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({ start: [0, 0], end: [1, 1] });

    engine._addObject(line);
    engine.undo();
    engine.redo();
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[line.id]).toEqual(line);
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
    const line1 = createLineSegmentModel({ start: [0, 0], end: [1, 1] });
    const line2 = createLineSegmentModel({ start: [1, 1], end: [2, 2] });
    const freeDraw = createFreeDrawModel({ points: [0, 0, 0.5, 0.5, 1, 1] });

    engine._addObject(line1);
    engine._addObject(line2);
    engine._addObject(freeDraw);

    let state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(3);

    engine.undo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(2);
    expect(state.objects[line1.id]).toEqual(line1);
    expect(state.objects[line2.id]).toEqual(line2);

    engine.undo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[line1.id]).toEqual(line1);

    engine.redo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(2);
    expect(state.objects[line1.id]).toEqual(line1);
    expect(state.objects[line2.id]).toEqual(line2);

    engine.redo();
    state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(3);
    expect(state.objects[line1.id]).toEqual(line1);
    expect(state.objects[line2.id]).toEqual(line2);
    expect(state.objects[freeDraw.id]).toEqual(freeDraw);
  });
});

describe("DrawingEngine - State", () => {
  it("clears the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({ start: [0, 0], end: [1, 1] });

    engine._addObject(line);
    engine.clear();

    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("serializes and deserializes state correctly", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentModel({ start: [0, 0], end: [1, 1] });
    engine._addObject(line);

    const serializedState = engine.getSerializedState();
    const deserializedState = JSON.parse(serializedState);

    expect(deserializedState).toHaveProperty("objects");
    expect(deserializedState.objects[line.id]).toEqual(line);
  });
});
