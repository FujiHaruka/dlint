import { join } from 'path'

import { ModuleResolver } from '../../../src/resolver/ModuleResolver'
import { ModuleTypes } from '../../../src/core/module/AbstractModule'

it('works', async () => {
  const projectRoot = join(__dirname, '../../fixtures/resolver-project')
  const resolver = new ModuleResolver({
    rootFile: join(projectRoot, 'root.js'),
  })

  await expect(resolver.resolve('fs')).resolves.toEqual({
    type: ModuleTypes.BUILTIN,
    name: 'fs',
  })
  await expect(resolver.resolve('some-package')).resolves.toEqual({
    type: ModuleTypes.PACKAGE,
    name: 'some-package',
  })
  const locals: [string, string][] = [
    ['./a', 'a.js'],
    ['./a.js', 'a.js'],
    ['./b', 'b.mjs'],
    ['./c', 'c.jsx'],
    ['./d', 'd.json'],
    ['./', 'index.js'],
    ['.', 'index.js'],
    ['./foo/b', './foo/b.js'],
    [
      '../../lib/resolver/ModuleResolver.test',
      '../../lib/resolver/ModuleResolver.test.ts',
    ],
    ['./bar-package', './bar-package/main.js'],
    ['./baz-package', './baz-package/index.js'],
  ]
  for (const [name, expected] of locals) {
    await expect(resolver.resolve(name)).resolves.toEqual({
      type: ModuleTypes.LOCAL,
      name: join(projectRoot, expected),
    })
  }
  const localFailings = ['./x', './a.json']
  for (const name of localFailings) {
    await expect(resolver.resolve(name)).rejects.toMatchObject({
      code: 'MODULE_NOT_FOUND',
    })
  }
})
