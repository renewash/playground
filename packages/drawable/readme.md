# Drawable

A framework-agnostic drawing engine for building interactive canvas editors (lines, polygons, free draw, etc.). It separates **state**, **interaction**, and **rendering** so the core logic remains independent of any UI or rendering library.

---

## Architecture

```txt
Engine (state)
├── Tools (input → mutations)
├── Geometry (models + calculations)
├── History (undo/redo)
└── UI (renderer, e.g. React/Konva)
```

- **Engine**: single source of truth and mutations
- **Tools**: handle user input and call engine APIs
- **UI**: reads state and renders
- **History**: command-based undo/redo

---

## Key Concepts

- **Transient state** (`inProgressObject`)
  - Mutable, used during drawing

- **Committed state** (`objects`)
  - Immutable snapshots stored in history

- **Unidirectional flow**

  ```
  Tool → Engine → State → UI
  ```

---

## Features

- Framework-agnostic core
- Tool-based interaction system
- Undo/redo via command pattern
- Extensible shape models
- Serializable state

---

## Current Gaps

- Tools are tightly coupled to engine APIs
- Tool registration is not fully externalized
- History for in progress objects
