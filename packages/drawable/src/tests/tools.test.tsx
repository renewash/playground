import { describe, expect, it } from "vitest";
import { createDrawingEngine } from "../core/engine";
import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";

describe("Tools", () => {
  it("initializes with default tool", () => {
    const engine = createDrawingEngine();
    const editorState = engine.getEditorState();
    expect(editorState.tool).toBeDefined();
    expect(editorState.tool.type).toBe("lineSegment");
  });

  it("switches to free draw tool", () => {
    const engine = createDrawingEngine();
    const freeDrawTool = createFreeDrawTool();
    engine.setTool(freeDrawTool);
    const editorState = engine.getEditorState();
    expect(editorState.tool).toBe(freeDrawTool);
    expect(editorState.tool.type).toBe("freeDraw");
  });

  it("switches back to line segment tool", () => {
    const engine = createDrawingEngine();
    const lineSegmentTool = createLineSegmentTool();
    engine.setTool(lineSegmentTool);
    const editorState = engine.getEditorState();
    expect(editorState.tool).toBe(lineSegmentTool);
    expect(editorState.tool.type).toBe("lineSegment");
  });
});

// describe("Drawable component", () => {
//   it("renders without crashing", () => {
//     const engine = createDrawingEngine();
//     render(<Drawable engine={engine} width={500} height={500} />);
//   });

// });
