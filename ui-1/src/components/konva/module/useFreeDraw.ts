import Konva from "konva";
import { useRef, useState } from "react";
import type { FlatPoint } from "./types";

export default function useFreeDraw() {
  const isDrawingRef = useRef(false);
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);

  const start = (e: Konva.KonvaEventObject<PointerEvent>) => {
    isDrawingRef.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setCurrentStroke([pos.x, pos.y]);
  };

  const move = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (currentStroke.length === 0 || !isDrawingRef.current) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setCurrentStroke((prev) => [...prev, pos.x, pos.y]);
    return currentStroke;
  };

  const end = () => {
    if (currentStroke.length === 0 || !isDrawingRef.current) return;
    isDrawingRef.current = false;
    const res = currentStroke;
    setCurrentStroke([]);
    return res;
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

  return { currentStroke, start, move, end, toPoints, toFlatPoints };
}
