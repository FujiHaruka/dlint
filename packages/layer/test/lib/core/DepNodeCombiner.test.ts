import { FilePath, FileFanout, ModuleType } from '@dlint/core'

import { DepNodeCombiner } from '../../../src/core/DepNodeCombiner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toPlainObject = (obj: any) => JSON.parse(JSON.stringify(obj))

it('works', () => {
  const fileFanouts: FileFanout[] = Object.entries({
    '/1': ['/2', '/3'],
    '/2': ['/3', '/4'],
    '/3': ['/4'],
    '/4': [],
  }).map(([path, locals]) => ({
    file: new FilePath('/', path),
    fanout: {
      locals: locals.map((path) => ({
        type: ModuleType.LOCAL,
        path: new FilePath('/', path),
      })),
      packages: [],
      builtins: [],
    },
  }))
  const nodes = DepNodeCombiner.combine(fileFanouts)
  expect(
    toPlainObject(nodes[0].fanin.locals.map(({ path }) => path.relativePath)),
  ).toEqual([])
  expect(nodes[1].fanin.locals.map(({ path }) => path.relativePath)).toEqual([
    '1',
  ])
  expect(nodes[2].fanin.locals.map(({ path }) => path.relativePath)).toEqual([
    '1',
    '2',
  ])
  expect(nodes[3].fanin.locals.map(({ path }) => path.relativePath)).toEqual([
    '2',
    '3',
  ])
})
