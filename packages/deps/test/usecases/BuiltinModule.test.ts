import { BuiltinModule } from '../../src/usecases/BuiltinModule'

it('works', () => {
  const mod = BuiltinModule.create('fs')
  expect(BuiltinModule.is(mod)).toBeTruthy()
})
