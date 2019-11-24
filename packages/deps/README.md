# @dlint/deps

Dependencies graph for dlint.

## Usage

```ts
import { Deps } from '@dlint/deps'

gatherDeps(['src/**/*.ts'], {
  rootDir: __dirname,
}).then(console.log)
```
