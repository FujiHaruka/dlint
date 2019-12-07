import { DepNodeCombiner } from '../../../../src/core/dep/DepNodeCombiner'
import { ModuleTypes } from '../../../../src/core/module/DLintModule'
import { FileFanout } from '../../../../src/core/dep/DepNode'
import { FilePath } from '../../../../src/core/module/FilePath'

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
        type: ModuleTypes.LOCAL,
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
