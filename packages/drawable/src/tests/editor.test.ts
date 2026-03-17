import { describe, expect, it } from "vitest";
import { createDrawingEngine } from "../core/engine";

describe("useEditor", () => {
  it("returns the current editor state", () => {
    const engine = createDrawingEngine();
    const editorState = engine.getEditorState();
    expect(editorState).toHaveProperty("tool");
    expect(editorState).toHaveProperty("style");
    expect(editorState).toHaveProperty("mode");
    expect(editorState).toHaveProperty("editable");
  });

  it("updates styles", () => {
    const engine = createDrawingEngine();
    engine.pickTool("freeDraw");
    engine.setStrokeColor("red");
    engine.setStrokeWidth(5);

    const editorState = engine.getEditorState();
    expect(editorState.tool.type).toBe("freeDraw");
    expect(editorState.style.strokeColor).toBe("red");
    expect(editorState.style.strokeWidth).toBe(5);
  });
});
