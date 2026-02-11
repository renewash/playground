import Konva from "konva";
import { useEffect, type RefObject } from "react";
import useDrawingStore from "@/components/konva/drawingStore";

export default function useFreeDraw(stageRef: RefObject<Konva.Stage | null>) {
  const {
    currentStroke,
    updateCurrentStroke,
    clearCurrentStroke,
    updateDraft,
    applyDraft,
  } = useDrawingStore();

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    updateCurrentStroke([pos.x, pos.y]);
  };

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!currentStroke) return;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    updateCurrentStroke([pos.x, pos.y]);
  };

  const handlePointerUp = () => {
    updateDraft(currentStroke);
    applyDraft();
    clearCurrentStroke();
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.on("mousedown touchstart", handlePointerDown);
    stage.on("mousemove touchmove", handlePointerMove);
    stage.on("mouseup touchend", handlePointerUp);

    return () => {
      stage.off("mousedown touchstart", handlePointerDown);
      stage.off("mousemove touchmove", handlePointerMove);
      stage.off("mouseup touchend", handlePointerUp);
    };
  }, [stageRef]);
}
