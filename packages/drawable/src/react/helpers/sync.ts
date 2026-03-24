// drawing/react/sync.ts

import { useSyncExternalStore } from "react";
import type {
  DrawingState,
  DrawingEngine,
  EditorState,
  AllEngineShapes,
} from "../../core/types";
import type { DrawableObject } from "../../geometry/types";

export const useScene = (engine: DrawingEngine): DrawingState => {
  return useSyncExternalStore(
    engine.subscribe,
    engine.getState,
    engine.getState,
  );
};

export const useInProgressObject = (
  engine: DrawingEngine,
): DrawableObject | null => {
  const snap = useSyncExternalStore(
    engine.subscribeTransient,
    engine.getTransientSnapshot,
    engine.getTransientSnapshot,
  );

  return snap.inProgressObject;
};

export const useAllEngineShapes = (engine: DrawingEngine): AllEngineShapes => {
  return useSyncExternalStore(engine.subscribe, () => ({
    committedObjects: engine.getState(),
    inProgressObject: engine.getTransientSnapshot().inProgressObject,
  }));
};

export const useEditor = (engine: DrawingEngine): EditorState => {
  return useSyncExternalStore(
    engine.subscribeEditor,
    engine.getEditorState,
    engine.getEditorState,
  );
};
