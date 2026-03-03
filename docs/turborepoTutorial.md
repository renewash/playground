# Using turborepo to manage a monorepo

## Principles

There are packages and apps

### Important nuances

In a monorepo, it is best to use a Single Version Policy (SVP) as much as possible. More versions = more complexity.

Same version gives better compatability and familiar DX. Cons are that it requires maintenance and discipline.

#### Packages

When developing packages, ensure use of peerDependencies. It prevents copies of packages.

E.g. in package/somePackageDev/package.json declares these peerDependencies.

```json
  "peerDependencies": {
    "konva": "^10",
    "react": "^19",
    "react-konva": "^19"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": false
    },
    "konva": {
      "optional": false
    },
    "react-konva": {
      "optional": false
    }
  }
```

This tells turborepo to use the app's deps instead. peepeerDependenciesMeta is used to ensure the build fails if deps are not met inside the app.
