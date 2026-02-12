import Konva from "konva";
import useDrawingStore from "@/components/konva/drawingStore";
import { useState } from "react";

export default function useFreeDraw() {
  const {
    currentStroke,
    updateCurrentStroke,
    clearCurrentStroke,
    updateDraft,
    applyDraft,
  } = useDrawingStore();

  const [isDrawing, setIsDrawing] = useState(false);

  const start = (e: Konva.KonvaEventObject<PointerEvent>) => {
    setIsDrawing(true);
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    updateCurrentStroke([pos.x, pos.y]);
  };

  const move = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!currentStroke || !isDrawing) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    updateCurrentStroke([pos.x, pos.y]);
  };

  const end = () => {
    if (!currentStroke || !isDrawing) return;
    setIsDrawing(false);
    updateDraft(currentStroke);
    clearCurrentStroke();
  };

  return { start, move, end };
}
