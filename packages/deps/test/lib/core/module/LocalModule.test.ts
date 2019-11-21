import path from 'path'

import { LocalModule } from '../../../../src/core/module/LocalModule'

it('works', () => {
  const mod = new LocalModule(path.resolve('./awesome'))
  expect(LocalModule.is(mod)).toBeTruthy()

  expect(() => new LocalModule('./awesome')).toThrow()
  expect(() => new LocalModule('awesome-package')).toThrow()
})
