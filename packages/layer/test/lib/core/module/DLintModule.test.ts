import { toKeyString, ModuleTypes } from '../../../../src/DLintLayer'
import { FilePath } from '../../../../src/core/module/FilePath'

it('toKeyString', () => {
  expect(
    toKeyString({
      type: ModuleTypes.LOCAL,
      path: new FilePath('/', 'a'),
    }),
  ).toBe('module:local#/a')
  expect(
    toKeyString({
      type: ModuleTypes.PACKAGE,
      name: 'p',
    }),
  ).toBe('module:package#p')
  expect(
    toKeyString({
      type: ModuleTypes.BUILTIN,
      name: 'fs',
    }),
  ).toBe('module:builtin#fs')
})
