import { DrawableObject } from "../geometry/types";
import { DrawingEngine } from "./types";

export interface Command {
  do(engine: DrawingEngine): void;
  undo(engine: DrawingEngine): void;
}

export class AddObjectCommand implements Command {
  constructor(private object: DrawableObject) {}

  undo(engine: DrawingEngine) {
    engine._removeObject(this.object.id);
  }

  do(engine: DrawingEngine) {
    engine._addObject(this.object);
  }
}

export class DeleteObjectCommand implements Command {
  constructor(private object: DrawableObject) {}

  undo(engine: DrawingEngine) {
    engine._addObject(this.object);
  }

  do(engine: DrawingEngine) {
    engine._removeObject(this.object.id);
  }
}

export default class History {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command, engine: DrawingEngine) {
    command.do(engine);
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo(engine: DrawingEngine) {
    const command = this.undoStack.pop();
    if (!command) return;

    command.undo(engine);
    this.redoStack.push(command);
  }

  redo(engine: DrawingEngine) {
    if (this.redoStack.length === 0) {
      console.error("there is nothing in redoStack to redo");
      return;
    }
    const command = this.redoStack.pop();
    command.do(engine);
    this.undoStack.push(command);
  }
}
