import { ModuleCreator } from '../../src/usecases/ModuleCreator'
import { DlintModuleTypes } from '../../src/entities/DlintModule'

it('works', () => {
  expect(ModuleCreator.create('fs').type).toBe(DlintModuleTypes.BUILTIN)
  expect(ModuleCreator.create('awesome').type).toBe(DlintModuleTypes.PACKAGE)
  expect(ModuleCreator.create('./foo').type).toBe(DlintModuleTypes.LOCAL)
  expect(ModuleCreator.create('/foo/bar/baz').type).toBe(DlintModuleTypes.LOCAL)
})
