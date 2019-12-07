import { join } from 'path'

import { ConfigFileReader } from '../../../src/io/ConfigFileReader'

it('reads reader/default.yaml', async () => {
  const reader = new ConfigFileReader({})
  const config = await reader.fromPath(
    join(__dirname, '../../fixtures/reader/default.yaml'),
  )
  expect(config).toEqual({ foo: 1 })
})

it('reads reader/default.yaml as default', async () => {
  const reader = new ConfigFileReader({
    defaultFileNames: ['default.yaml'],
  })
  const config = await reader.fromPath(join(__dirname, '../../fixtures/reader'))
  expect(config).toEqual({ foo: 1 })
})

it('reads reader/default.json as default', async () => {
  const reader = new ConfigFileReader({
    defaultFileNames: ['default.json'],
  })
  const config = await reader.fromPath(join(__dirname, '../../fixtures/reader'))
  expect(config).toEqual({ foo: 1 })
})
