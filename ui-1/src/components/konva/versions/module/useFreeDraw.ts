import Konva from "konva";
import { useRef } from "react";
import type { FlatPoint, DrawingStore } from "./types";

export function useFreeDraw(session: DrawingStore) {
  const isDrawingRef = useRef(false);

  const start = (e: Konva.KonvaEventObject<PointerEvent>) => {
    isDrawingRef.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    session.addStrokePoint([pos.x, pos.y]);
  };

  const move = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!isDrawingRef.current) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    session.addStrokePoint([pos.x, pos.y]);
  };

  const end = () => {
    if (session.getSnapshot().activeStroke.length <= 4 || !isDrawingRef.current)
      return;

    isDrawingRef.current = false;
    session.addCompletedStroke();
  };

  const toPoints = () => {
    const points: FlatPoint[][] = [];
    return points;
  };

  const toFlatPoints = (committedStrokes: number[][]) => {
    const flatPoints: FlatPoint[][] = [];
    for (const stroke of committedStrokes) {
      const flatStroke: FlatPoint[] = [];
      for (let i = 0; i < stroke.length; i += 2) {
        flatStroke.push([stroke[i], stroke[i + 1]]);
      }
      flatPoints.push(flatStroke);
    }
    return flatPoints;
  };

  return { start, move, end, toPoints, toFlatPoints };
}
