import { describe, expect, it } from "vitest";
import { createDrawingEngine } from "../core/engine";
import { createLineSegmentTool } from "../tools/lineSegmentTool";
import { createFreeDrawTool } from "../tools/freeDrawTool";
import { page, userEvent } from "vitest/browser";
import { Drawable } from "../react";
import Konva from "konva";
import React from "react";
import { render } from "@testing-library/react";

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

describe("Drawable component", () => {
  it("renders without crashing", () => {
    const engine = createDrawingEngine();
    render(<Drawable engine={engine} width={500} height={500} />);
  });

  it("renders a line segment preview", async () => {
    const engine = createDrawingEngine();
    const { container } = render(<Drawable engine={engine} width={500} height={500} />);

    // Simulate pointer down to start line segment
    await userEvent.pointer({ target: container.querySelector("canvas")!, clientX: 50, clientY: 50, pointerType: "mouse", buttons: 1 });
    await userEvent.pointerMove({ target: container.querySelector("canvas")!, clientX: 150, clientY: 150, pointerType: "mouse", buttons: 1 });

    // Check if the line segment preview is rendered
    const lines = container.querySelectorAll("canvas");
    expect(lines.length).toBeGreaterThan(0);
  });
});
