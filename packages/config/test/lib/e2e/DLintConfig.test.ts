import { join } from 'path'

import { DLintConfig } from '../../../src/DLintConfig'

it('works', async () => {
  const projectDir = join(__dirname, '../../fixtures/project01')
  const config = await DLintConfig.load(projectDir)
  expect(config.configPath).toEqual(join(projectDir, 'dlint-rules.yml'))
  expect(Object.values(config.fields).length).toBeGreaterThan(0)

  expect(config.layers()).toBeTruthy()
  expect(config.rules()).toBeTruthy()
})

it('works with errors', async () => {
  const projectDir = join(__dirname, '../../fixtures/configs/invalid01.yml')
  await expect(DLintConfig.load(projectDir)).rejects.toBeInstanceOf(Error)
})
