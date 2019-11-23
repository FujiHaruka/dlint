import { resolve } from 'path'

import { gatherDeps } from '../../../src/Deps'

it('works', async () => {
  // cjs-project01/            require
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

  const deps = await gatherDeps(['**/*.js'], {
    rootDir: resolve(__dirname, '../../fixtures/cjs-project01'),
  })
  const findDep = (file: string) => deps.find((dep) => dep.file === file)
  expect(findDep('a/moduleA.js')).toMatchObject({
    fanin: {
      locals: ['b/moduleB1.js', 'b/moduleB2.js'],
    },
    fanout: {
      locals: ['a/x/moduleAX.js', 'a/y/index.js'],
    },
  })
  expect(findDep('b/moduleB1.js')).toMatchObject({
    fanin: {
      locals: ['b/moduleB2.js'],
    },
    fanout: {
      locals: ['a/moduleA.js'],
    },
  })
  expect(findDep('b/moduleB2.js')).toMatchObject({
    fanin: {
      locals: [],
    },
    fanout: {
      locals: ['b/moduleB1.js', 'a/moduleA.js'],
      builtins: ['fs'],
    },
  })
  expect(findDep('a/x/moduleAX.js')).toMatchObject({
    fanin: {
      locals: ['a/moduleA.js'],
    },
    fanout: {
      builtins: ['fs'],
    },
  })
  expect(findDep('a/y/index.js')).toMatchObject({
    fanin: {
      locals: ['a/moduleA.js'],
    },
    fanout: {
      locals: ['a/y/moduleAY.js'],
    },
  })
  expect(findDep('a/y/moduleAY.js')).toMatchObject({
    fanin: {
      locals: ['a/y/index.js'],
    },
    fanout: {
      packages: ['@types/node'],
      builtins: ['path'],
    },
  })
})
