import { DrawingEngine } from "../core/types";

export const undoRedoShortcut =
  (engine: DrawingEngine) => (e: KeyboardEvent) => {
    const isMac = /Mac/i.test(navigator.userAgent);

    const modifier = isMac ? e.metaKey : e.ctrlKey;
    // Undo: Ctrl/Cmd + Z
    if (modifier && e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();
      engine.undo();
    }

    // Redo: Ctrl/Cmd + Y OR Ctrl/Cmd + Shift + Z
    if (isMac && modifier && e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      engine.redo();
    } else if (!isMac && modifier && e.key.toLowerCase() === "y") {
      e.preventDefault();
      engine.redo();
    }
  };
