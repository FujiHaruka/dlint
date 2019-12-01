import { resolve } from 'path'

import { gatherDeps } from '../../../src/Deps'
import {
  ModuleTypes,
  LocalModule,
  PackageModule,
  BuiltinModule,
} from '../../../src/core/module/DLintModule'
import { FilePath } from '../../../src/core/module/FilePath'

it('works', async () => {
  // ems-project01/            import
  // ├── a
  // │   ├── moduleA.js      - ./x/moduleAX ./y
  // │   ├── x
  // │   │   └── moduleAX.js - fs
  // │   └── y
  // │       ├── index.js    - ./moduleAY
  // │       └── moduleAY.js - path, @types/node
  // └── b
  //     ├── moduleB1.js     - ../a/moduleA
  //     └── moduleB2.js     - fs ./moduleB1 ../a/moduleA

  const rootDir = resolve(__dirname, '../../fixtures/esm-project01')
  const gathered = await gatherDeps(['**/*.js'], {
    rootDir,
  })
  const Local = (file: string): LocalModule => ({
    type: ModuleTypes.LOCAL,
    path: new FilePath(rootDir, file),
  })
  const Package = (name: string): PackageModule => ({
    type: ModuleTypes.PACKAGE,
    name,
  })
  const Builtin = (name: string): BuiltinModule => ({
    type: ModuleTypes.BUILTIN,
    name,
  })
  const findDep = (file: string) =>
    gathered.nodes.find((node) => node.file.relativePath === file)
  expect(findDep('a/moduleA.js')).toMatchObject({
    fanin: {
      locals: [Local('b/moduleB1.js'), Local('b/moduleB2.js')],
    },
    fanout: {
      locals: [Local('a/x/moduleAX.js'), Local('a/y/index.js')],
    },
  })
  expect(findDep('b/moduleB1.js')).toMatchObject({
    fanin: {
      locals: [Local('b/moduleB2.js')],
    },
    fanout: {
      locals: [Local('a/moduleA.js')],
    },
  })
  expect(findDep('b/moduleB2.js')).toMatchObject({
    fanin: {
      locals: [],
    },
    fanout: {
      locals: [Local('b/moduleB1.js'), Local('a/moduleA.js')],
      builtins: [Builtin('fs')],
    },
  })
  expect(findDep('a/x/moduleAX.js')).toMatchObject({
    fanin: {
      locals: [Local('a/moduleA.js')],
    },
    fanout: {
      builtins: [Builtin('fs')],
    },
  })
  expect(findDep('a/y/index.js')).toMatchObject({
    fanin: {
      locals: [Local('a/moduleA.js')],
    },
    fanout: {
      locals: [Local('a/y/moduleAY.js')],
    },
  })
  expect(findDep('a/y/moduleAY.js')).toMatchObject({
    fanin: {
      locals: [Local('a/y/index.js')],
    },
    fanout: {
      packages: [Package('@types/node')],
      builtins: [Builtin('path')],
    },
  })
})
