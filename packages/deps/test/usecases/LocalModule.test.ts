import path from 'path'

import { LocalModule } from '../../src/usecases/LocalModule'

it('works', () => {
  const mod = LocalModule.create(path.resolve('./awesome'))
  expect(LocalModule.is(mod)).toBeTruthy()

  expect(() => LocalModule.create('./awesome')).toThrow()
  expect(() => LocalModule.create('awesome-package')).toThrow()
})
