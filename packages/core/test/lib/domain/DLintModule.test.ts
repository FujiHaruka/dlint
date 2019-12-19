import { DLintModuleUtil, LocalModule } from '../../../src/domain/DLintModule'
import { FilePath } from '../../../src/std/FilePath'
import { ModuleType } from '../../../src/enum/ModuleType'
import { PackageModule, BuiltinModule } from '../../../build'

const local: LocalModule = {
  type: ModuleType.LOCAL,
  path: new FilePath('/', 'a'),
}
const pkg: PackageModule = {
  type: ModuleType.PACKAGE,
  name: 'p',
}
const builtin: BuiltinModule = {
  type: ModuleType.BUILTIN,
  name: 'fs',
}

it('toKeyString', () => {
  expect(DLintModuleUtil.toKeyString(local)).toBe('module:local#/a')
  expect(DLintModuleUtil.toKeyString(pkg)).toBe('module:package#p')
  expect(DLintModuleUtil.toKeyString(builtin)).toBe('module:builtin#fs')
})

it('format', () => {
  expect(DLintModuleUtil.format(local)).toEqual(local.path.relativePath)
  expect(DLintModuleUtil.format(pkg)).toEqual(pkg.name)
  expect(DLintModuleUtil.format(builtin)).toEqual(builtin.name)
})

it('is', () => {
  expect(DLintModuleUtil.is.LocalModule(local)).toBeTruthy()
  expect(DLintModuleUtil.is.PackageModule(pkg)).toBeTruthy()
  expect(DLintModuleUtil.is.BuiltinModule(builtin)).toBeTruthy()

  expect(DLintModuleUtil.is.LocalModule(pkg)).toBeFalsy()
  expect(DLintModuleUtil.is.PackageModule(builtin)).toBeFalsy()
  expect(DLintModuleUtil.is.BuiltinModule(local)).toBeFalsy()
})
