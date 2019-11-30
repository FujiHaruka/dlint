import { join } from 'path'

import { DLintConfig } from '../../../src/core/DLintConfigSchema'
import { DLintConfigBuilder } from '../../../src/Config'

it('fromJSON', () => {
  const config = DLintConfigBuilder.fromJSON({
    rootDir: '/foo/project',
    include: ['src/**/*.ts'],
    rules: [],
    parser: '',
  })
  expect(config).toEqual({
    rootDir: '/foo/project',
    include: ['src/**/*.ts'],
    exclude: [],
    rules: [],
    parser: '',
  } as DLintConfig)

  expect(() =>
    DLintConfigBuilder.fromJSON({
      rootDir: '/foo/project',
      rules: [],
      parser: '',
    }),
  ).toThrow('"include" field is required')
})

it('fromJsonFile', async () => {
  const config = await DLintConfigBuilder.fromJsonFile(
    join(__dirname, '../../fixtures/dlintrc.1.json'),
  )
  expect(config).toEqual({
    include: ['src/**/*.ts'],
    exclude: ['**/__test__/**/*'],
    rules: [],
  })
})
