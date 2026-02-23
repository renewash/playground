// drawing/react/useDrawing.ts

import { useSyncExternalStore } from "react";
import { type DrawingEngine } from "../core/engine";
import { type DrawingState } from "../core/types";

export function useDrawing(engine: DrawingEngine): DrawingState {
  return useSyncExternalStore(
    engine.subscribe,
    engine.getState,
    engine.getState,
  );
}
