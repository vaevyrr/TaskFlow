# TaskFlow

A dependency-aware local task runner for small automation jobs.

## Features

- Named shell tasks
- Dependency ordering
- Dependency cycle detection
- Sequential execution
- Dry-run planning
- JSON execution history
- Per-task timeouts

Only run task files you trust. Commands execute with the same permissions as the Node process.

## Usage

Node.js 18+.

```bash
node src/index.js examples/tasks.json
node src/index.js examples/tasks.json --dry-run
npm test
```

MIT licensed.
