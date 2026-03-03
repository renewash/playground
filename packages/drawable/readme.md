# Drawing Module Architecture

## Principles

- Unidirectional data flow
- Engine is framework-agnostic
- Tools produce primitives
- Renderer renders primitives only
- React is a thin binding layer
- Static and in progress objects are separated
  - Static objects are declaratively drawn
  - Objects being drawn (in progress) are impratively drawn

---

## Summary

1. (Tools) compose primative shapes + calls mutations.
2. (Core) Engine manages domain and objects / state, provides mutations and other features.
3. (React) Binds engine and tools to react.

## 1. State

**Single source of truth**

- Normalized primitive objects
- Relationships (optional)
- History (undo/redo)
- No React
- No rendering logic

```ts
type ObjectStore = Record<string, DrawableObject>;
```

---

## 2. Domain (Primitives)

Define only renderable shapes.

```ts
type Line = { id: string; type: "line"; start: Point; end: Point };
type Circle = { id: string; type: "circle"; center: Point; radius: number };
```

Do not encode tool semantics here.

---

## 3. Engine (Creation & Mutation)

Pure business logic.

- Create objects
- Mutate objects
- Apply constraints
- No UI dependencies

Fully testable without React.

---

## 4. Tools (Interaction Layer)

Translate pointer events into engine mutations.

Example lifecycle:

```
onPointerDown → create
onPointerMove → mutate
onPointerUp   → finalize
```

Tools compose primitives.

A “line with markers” tool creates:

- 1 Line
- 2 Circles

It does not create a special composite object.

---

## 5. Binding (React Adapter)

- Subscribes to engine state
- Forwards pointer events to active tool
- Triggers re-renders

Thin layer only.

---

## 6. Renderer

Render primitives only.

```tsx
objects.map((obj) => {
  switch (obj.type) {
    case "line":
      return <Line {...obj} />;
    case "circle":
      return <Circle {...obj} />;
  }
});
```

The renderer must not understand tools or semantic groupings.

---

## Data Flow

```
User Input
   ↓
Tool
   ↓
Engine (mutates domain objects in state)
   ↓
State
   ↓
React Binding
   ↓
Renderer
```

---
