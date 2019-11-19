import { ModuleCreator } from '../../../src/usecase/module/ModuleCreator'
import { BuiltinModule } from '../../../src/core/module/BuiltinModule'
import { PackageModule } from '../../../src/core/module/PackageModule'
import { LocalModule } from '../../../src/core/module/LocalModule'

it('works', () => {
  expect(BuiltinModule.is(ModuleCreator.create('fs'))).toBeTruthy()
  expect(PackageModule.is(ModuleCreator.create('awesome'))).toBeTruthy()
  expect(LocalModule.is(ModuleCreator.create('./foo'))).toBeTruthy()
  expect(LocalModule.is(ModuleCreator.create('/foo/bar/baz'))).toBeTruthy()
})
