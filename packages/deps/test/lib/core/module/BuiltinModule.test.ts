import { BuiltinModule } from '../../../../src/core/module/BuiltinModule'

it('works', () => {
  const mod = new BuiltinModule('fs')
  expect(BuiltinModule.is(mod)).toBeTruthy()
})
