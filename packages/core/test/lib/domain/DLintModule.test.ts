import { DLintModuleUtil } from '../../../src/domain/DLintModule'
import { FilePath } from '../../../src/std/FilePath'
import { ModuleType } from '../../../src/enum/ModuleType'

it('toKeyString', () => {
  expect(
    DLintModuleUtil.toKeyString({
      type: ModuleType.LOCAL,
      path: new FilePath('/', 'a'),
    }),
  ).toBe('module:local#/a')
  expect(
    DLintModuleUtil.toKeyString({
      type: ModuleType.PACKAGE,
      name: 'p',
    }),
  ).toBe('module:package#p')
  expect(
    DLintModuleUtil.toKeyString({
      type: ModuleType.BUILTIN,
      name: 'fs',
    }),
  ).toBe('module:builtin#fs')
})
