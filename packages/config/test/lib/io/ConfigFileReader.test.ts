import { join } from 'path'

import { ConfigFileReader } from '../../../src/io/ConfigFileReader'

const CONFIG_DIR = join(__dirname, '../../fixtures/reader')

it('reads reader/default.yaml', async () => {
  const reader = new ConfigFileReader({})
  const config = await reader.fromPath(
    await reader.resolveConfigPath(join(CONFIG_DIR, 'default.yaml')),
  )
  expect(config).toEqual({ foo: 1 })
})

it('reads reader/default.yaml as default', async () => {
  const reader = new ConfigFileReader({
    defaultFileNames: ['default.yaml'],
  })
  const config = await reader.fromPath(
    await reader.resolveConfigPath(CONFIG_DIR),
  )
  expect(config).toEqual({ foo: 1 })
})

it('reads reader/default.json as default', async () => {
  const reader = new ConfigFileReader({
    defaultFileNames: ['default.json'],
  })
  const config = await reader.fromPath(
    await reader.resolveConfigPath(CONFIG_DIR),
  )
  expect(config).toEqual({ foo: 1 })
})

it('errors', async () => {
  await expect(
    new ConfigFileReader({
      defaultFileNames: [],
    }).resolveConfigPath(CONFIG_DIR),
  ).rejects.toBeInstanceOf(Error)
  await expect(
    new ConfigFileReader({
      defaultFileNames: [],
    }).resolveConfigPath(join(CONFIG_DIR, 'default.txt')),
  ).rejects.toBeInstanceOf(Error)
  await expect(
    new ConfigFileReader({
      defaultFileNames: [],
    }).resolveConfigPath(join(CONFIG_DIR, 'not-found.txt')),
  ).rejects.toBeTruthy()
  await expect(
    new ConfigFileReader({
      defaultFileNames: [],
    }).fromPath(join(CONFIG_DIR, 'default.txt')),
  ).rejects.toBeInstanceOf(Error)
})
