import { DLintConfig } from '../../../src/core/DLintConfigSchema'
import { DlintConfigBuilder } from '../../../src/Config'

it('works', () => {
  const config = DlintConfigBuilder.fromJSON({
    root: '/foo/project',
    include: ['src/**/*.ts'],
    rules: [],
    parser: '',
  })
  expect(config).toEqual({
    root: '/foo/project',
    include: ['src/**/*.ts'],
    exclude: [],
    rules: [],
    parser: '',
  } as DLintConfig)
})
