import Konva from "konva";
import type { LineConfig } from "konva/lib/shapes/Line";

type Point = {
  x: number;
  y: number;
};

type Points = Point[];

export type Stroke = {
  points: Points;
};

type Callbacks = {
  onStrokeStart?: () => void;
  onStrokeUpdate?: (points?: number[]) => void;
  onStrokeEnd?: (points?: Points) => void;
};

/**
 * Agnostic Konva drawing API.
 * Methods: start, move and end.
 * Frameworks can utilise the API for a consistent drawing experience.
 *
 * @export
 * @class KonvaFreeDrawingTool
 * @typedef {KonvaFreeDrawingTool}
 */
export default class KonvaFreeDrawingTool {
  private layer: Konva.Layer;
  private line?: Konva.Line;
  private callbacks: Callbacks;
  private konvaPoints: number[] = [];

  constructor(layer: Konva.Layer, callbacks: Callbacks) {
    this.layer = layer;
    this.callbacks = callbacks;
  }

  // TODO: default configuration. colors, width, etc.
  start(pos: Point, options: LineConfig = { stroke: "red", strokeWidth: 3 }) {
    this.konvaPoints = [pos.x, pos.y];
    const { stroke, strokeWidth } = options;
    this.line = new Konva.Line({
      points: this.konvaPoints,
      stroke,
      strokeWidth,
    });

    this.layer.add(this.line);
    this.callbacks.onStrokeStart?.();
  }

  move(pos: Point) {
    if (!this.line) return;

    this.konvaPoints.push(pos.x);
    this.konvaPoints.push(pos.y);

    this.line.points(this.konvaPoints);
    this.layer.batchDraw();
    this.callbacks.onStrokeUpdate?.(this.konvaPoints);
  }

  end() {
    if (!this.line) return;

    this.line = undefined;
    this.callbacks.onStrokeEnd?.(this.transformPoints());
  }

  transformPoints() {
    const points: Points = [];

    for (let i = 0; i < this.konvaPoints.length; i += 2) {
      points.push({ x: this.konvaPoints[i], y: this.konvaPoints[i + 1] });
    }

    return points;
  }
}
