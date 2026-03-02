// drawing/react/useScene.ts

import { useSyncExternalStore } from "react";
import type { DrawingState, DrawingEngine } from "../core/types";

export function useScene(engine: DrawingEngine): DrawingState {
  return useSyncExternalStore(
    engine.subscribe,
    engine.getState,
    engine.getState,
  );
}
