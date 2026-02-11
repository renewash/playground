type Point = {
  x: number;
  y: number;
};

type Points = Point[];

export type Stroke = {
  KonvaPoints: number[];
};

type Callbacks = {
  onStrokeStart?: () => void;
  onStrokeUpdate?: (points: number[]) => void;
  onStrokeEnd?: (points: Points) => void;
};

/**
 * Agnostic Konva drawing Interface.
 * Interface describes drawing methods.
 *
 * @export
 * @class KonvaFreeDrawingTool
 * @typedef {KonvaFreeDrawingTool}
 */
export default class KonvaFreeDrawingTool {
  private callbacks: Callbacks;
  private konvaPoints: number[] = [];

  constructor(callbacks: Callbacks) {
    this.callbacks = callbacks;
  }

  start(pos: Point) {
    this.konvaPoints = [pos.x, pos.y];
    this.callbacks.onStrokeStart?.();
    this.callbacks.onStrokeUpdate?.(this.konvaPoints);
  }

  move(pos: Point) {
    this.konvaPoints.push(pos.x, pos.y);
    this.callbacks.onStrokeUpdate?.(this.konvaPoints);
  }

  end() {
    const transformed = this.transformPoints();
    this.callbacks.onStrokeEnd?.(transformed);
    this.konvaPoints = [];
  }

  transformPoints() {
    const points: Points = [];

    for (let i = 0; i < this.konvaPoints.length; i += 2) {
      points.push({ x: this.konvaPoints[i], y: this.konvaPoints[i + 1] });
    }

    return points;
  }
}
