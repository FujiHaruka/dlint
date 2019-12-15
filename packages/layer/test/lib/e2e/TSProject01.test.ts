import { resolve } from 'path'

import {
  FilePath,
  ModuleType,
  LocalModule,
  PackageModule,
  BuiltinModule,
  ParserPackage,
} from '@dlint/core'

import { DLintLayer } from '../../../src/DLintLayer'

it('works', async () => {
  // ts-project01/            import
  // ├── a
  // │   ├── moduleA.ts      - ./x/moduleAX ./y
  // │   ├── x
  // │   │   └── moduleAX.ts - fs
  // │   └── y
  // │       ├── index.ts    - ./moduleAY
  // │       └── moduleAY.ts - path, @types/node
  // └── b
  //     ├── moduleB1.ts     - ../a/moduleA
  //     └── moduleB2.ts     - fs ./moduleB1 ../a/moduleA

  const rootDir = resolve(__dirname, '../../fixtures/ts-project01')
  const layer = await DLintLayer.gatherDeps('layer', ['**/*.ts'], {
    rootDir,
    parser: ParserPackage.TS,
  })
  const Local = (file: string): LocalModule => ({
    type: ModuleType.LOCAL,
    path: new FilePath(rootDir, file),
  })
  const Package = (name: string): PackageModule => ({
    type: ModuleType.PACKAGE,
    name,
  })
  const Builtin = (name: string): BuiltinModule => ({
    type: ModuleType.BUILTIN,
    name,
  })
  const findDep = (file: string) =>
    layer.nodes.find((node) => node.file.relativePath === file)
  expect(findDep('a/moduleA.ts')).toMatchObject({
    fanin: {
      locals: [Local('b/moduleB1.ts'), Local('b/moduleB2.ts')],
    },
    fanout: {
      locals: [Local('a/x/moduleAX.ts'), Local('a/y/index.ts')],
    },
  })
  expect(findDep('b/moduleB1.ts')).toMatchObject({
    fanin: {
      locals: [Local('b/moduleB2.ts')],
    },
    fanout: {
      locals: [Local('a/moduleA.ts')],
    },
  })
  expect(findDep('b/moduleB2.ts')).toMatchObject({
    fanin: {
      locals: [],
    },
    fanout: {
      locals: [Local('b/moduleB1.ts'), Local('a/moduleA.ts')],
      builtins: [Builtin('fs')],
    },
  })
  expect(findDep('a/x/moduleAX.ts')).toMatchObject({
    fanin: {
      locals: [Local('a/moduleA.ts')],
    },
    fanout: {
      builtins: [Builtin('fs')],
    },
  })
  expect(findDep('a/y/index.ts')).toMatchObject({
    fanin: {
      locals: [Local('a/moduleA.ts')],
    },
    fanout: {
      locals: [Local('a/y/moduleAY.ts')],
    },
  })
  expect(findDep('a/y/moduleAY.ts')).toMatchObject({
    fanin: {
      locals: [Local('a/y/index.ts')],
    },
    fanout: {
      packages: [Package('@types/node')],
      builtins: [Builtin('path')],
    },
  })
})
