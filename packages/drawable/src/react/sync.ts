// drawing/react/useScene.ts

import { useSyncExternalStore } from "react";
import type { DrawingState, DrawingEngine, EditorState } from "../core/types";
import type { DrawableObject } from "../geometry/types";

export function useScene(engine: DrawingEngine): DrawingState {
  return useSyncExternalStore(
    engine.subscribe,
    engine.getState,
    engine.getState,
  );
}

export function useInProgressObject(
  engine: DrawingEngine,
): DrawableObject | null {
  const snap = useSyncExternalStore(
    engine.subscribeTransient,
    engine.getTransientSnapshot,
    engine.getTransientSnapshot,
  );

  return snap.inProgressObject;
}

export function useEditor(engine: DrawingEngine): EditorState {
  return useSyncExternalStore(
    engine.subscribeEditor,
    engine.getEditorState,
    engine.getEditorState,
  );
}
