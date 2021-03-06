import { join } from 'path'

import { ModuleType, FilePath } from '@dlint/core'

import { ModuleResolver } from '../../../src/resolver/ModuleResolver'

it('works', async () => {
  const projectRoot = join(__dirname, '../../fixtures/resolver-project')
  const rootFile = join(projectRoot, 'root.js')
  const resolver = new ModuleResolver('/')
  const resolve = (name: string) => resolver.resolve(rootFile, name)

  await expect(resolve('fs')).resolves.toEqual({
    type: ModuleType.BUILTIN,
    name: 'fs',
  })
  await expect(resolve('some-package')).resolves.toEqual({
    type: ModuleType.PACKAGE,
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
    await expect(resolve(name)).resolves.toEqual({
      type: ModuleType.LOCAL,
      path: new FilePath('/', join(projectRoot, expected)),
    })
  }
  const localFailings = ['./x', './a.json']
  for (const name of localFailings) {
    await expect(resolve(name)).rejects.toMatchObject({
      code: 'MODULE_NOT_FOUND',
    })
  }
})
