import { BuiltinModule } from '../../src/usecases/BuiltinModule'

it('works', () => {
  const mod = new BuiltinModule('fs')
  expect(BuiltinModule.is(mod)).toBeTruthy()
})
