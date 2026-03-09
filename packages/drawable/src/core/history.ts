import { DrawingEngine } from "./types";

interface Command {
  do(engine: DrawingEngine): void;
  undo(engine: DrawingEngine): void;
}

export default class History {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  addObject(object) {
    const command = {
      do(engine) {
        engine;
      },
      undo(engine) {},
    };

    this.undoStack.push(command);
  }

  undo(engine: DrawingEngine) {
    const command = this.undoStack.pop();
    command.undo(engine);
    this.redoStack.push();
  }

  redo(engine: DrawingEngine) {
    const command = this.redoStack.pop();
    command.do(engine);
    this.undoStack.push();
  }

  // when any action is done, should not be able to execute an redo action
  // TODO: place in Emit()?
  clearRedoStack() {
    this.redoStack = [];
  }
}
