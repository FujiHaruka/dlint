import { join, basename } from 'path'

import { DLintConfig } from '../../../src/DLintConfig'

it('works', async () => {
  const configFilePath = join(__dirname, '../../fixtures/dlintrc.1.json')
  const config = await DLintConfig.read(configFilePath)
  expect(config.fields).toEqual({
    rootDir: basename(configFilePath),
    include: ['src/**/*.ts'],
    exclude: ['**/__test__/**/*'],
    rules: [],
    parser: DLintConfig.Defaults.PARSER,
  })
})
