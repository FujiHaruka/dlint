import { DepNodeBuilder } from '../../../../src/core/dep/DepNodeBuilder'
import { FileDep } from '../../../../src/core/dep/FileDep'
import { LocalModule } from '../../../../src/core/module/LocalModule'

it('works', () => {
  const fileDeps = Object.entries({
    '/1': ['/2', '/3'],
    '/2': ['/3', '/4'],
    '/3': ['/4'],
    '/4': [],
  }).map(
    ([file, locals]) =>
      new FileDep(file, {
        locals: locals.map((file) => new LocalModule(file)),
        packages: [],
        builtins: [],
      }),
  )
  const nodes = DepNodeBuilder.fromFileDeps(fileDeps)
  expect(nodes[0].fanin.locals.map((local) => local.path)).toEqual([])
  expect(nodes[1].fanin.locals.map((local) => local.path)).toEqual(['/1'])
  expect(nodes[2].fanin.locals.map((local) => local.path)).toEqual(['/1', '/2'])
  expect(nodes[3].fanin.locals.map((local) => local.path)).toEqual(['/2', '/3'])
})
