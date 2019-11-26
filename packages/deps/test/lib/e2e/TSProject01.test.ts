import { resolve } from 'path'

import { parse } from '@typescript-eslint/typescript-estree'

import { gatherDeps } from '../../../src/Deps'

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

  const gathered = await gatherDeps(['**/*.ts'], {
    rootDir: resolve(__dirname, '../../fixtures/ts-project01'),
    parser: {
      parse,
    },
  })
  const findDep = (file: string) =>
    gathered.nodes.find((node) => node.file === file)
  expect(findDep('a/moduleA.ts')).toMatchObject({
    fanin: {
      locals: ['b/moduleB1.ts', 'b/moduleB2.ts'],
    },
    fanout: {
      locals: ['a/x/moduleAX.ts', 'a/y/index.ts'],
    },
  })
  expect(findDep('b/moduleB1.ts')).toMatchObject({
    fanin: {
      locals: ['b/moduleB2.ts'],
    },
    fanout: {
      locals: ['a/moduleA.ts'],
    },
  })
  expect(findDep('b/moduleB2.ts')).toMatchObject({
    fanin: {
      locals: [],
    },
    fanout: {
      locals: ['b/moduleB1.ts', 'a/moduleA.ts'],
      builtins: ['fs'],
    },
  })
  expect(findDep('a/x/moduleAX.ts')).toMatchObject({
    fanin: {
      locals: ['a/moduleA.ts'],
    },
    fanout: {
      builtins: ['fs'],
    },
  })
  expect(findDep('a/y/index.ts')).toMatchObject({
    fanin: {
      locals: ['a/moduleA.ts'],
    },
    fanout: {
      locals: ['a/y/moduleAY.ts'],
    },
  })
  expect(findDep('a/y/moduleAY.ts')).toMatchObject({
    fanin: {
      locals: ['a/y/index.ts'],
    },
    fanout: {
      packages: ['@types/node'],
      builtins: ['path'],
    },
  })
})
