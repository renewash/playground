import { describe, expect, it } from "vitest";
import { createDrawingEngine } from "../core/engine";
import { createLineSegmentTool } from "../tools/lineSegmentTool";

describe("DrawingEngine", () => {
  it("initializes with default state", () => {
    const engine = createDrawingEngine();
    const state = engine.getState();
    expect(state).toHaveProperty("objects");
    expect(state.objects).toEqual({});
  });

  it("adds an object to the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentTool([0, 0], [1, 1]);
    engine.addObject(line);
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[line.id]).toEqual(line);
  });

  it("deletes an object from the scene", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentTool([0, 0], [1, 1]);
    engine.addObject(line);
    engine.deleteObjectById(line.id);
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("undoes an action", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentTool([0, 0], [1, 1]);
    engine.addObject(line);
    engine.undo();
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(0);
  });

  it("redoes an action", () => {
    const engine = createDrawingEngine();
    const line = createLineSegmentTool([0, 0], [1, 1]);
    engine.addObject(line);
    engine.undo();
    engine.redo();
    const state = engine.getState();
    expect(Object.keys(state.objects).length).toBe(1);
    expect(state.objects[line.id]).toEqual(line);
  });
});
