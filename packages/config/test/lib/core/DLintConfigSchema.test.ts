import { promises as fs } from 'fs'
import { join, resolve } from 'path'

import yaml from 'js-yaml'

import {
  DLintConfigSchema,
  DLintConfigFields,
} from '../../../src/core/DLintConfigSchema'

it('project01: standard config', async () => {
  const config = yaml.safeLoad(
    await fs.readFile(
      join(__dirname, '../../fixtures/project01/dlint-rules.yml'),
      'utf-8',
    ),
  )
  const schema = new DLintConfigSchema()
  const valid = schema.validate(config)
  expect(valid).toBeTruthy()
  expect(schema.errors).toBeNull()

  expect(schema.fillDefaults(config, { configDir: __dirname })).toEqual({
    ...config,
    rootDir: resolve(__dirname, 'src'),
  })
})

it('project02: rule fields allow null', async () => {
  const config = yaml.safeLoad(
    await fs.readFile(
      join(__dirname, '../../fixtures/project02/dlint-rules.yml'),
      'utf-8',
    ),
  )
  const schema = new DLintConfigSchema()
  const valid = schema.validate(config)
  expect(valid).toBeTruthy()
  expect(schema.errors).toBeNull()
  expect(
    schema.fillDefaults(config, { configDir: __dirname }).rules.layer1,
  ).toEqual([])
})

it('fills default fields', () => {
  const config: Partial<DLintConfigFields> = {
    layers: {},
    rules: {},
  }
  const schema = new DLintConfigSchema()
  const valid = schema.validate(config)
  expect(valid).toBeTruthy()
  expect(schema.errors).toBeNull()

  const filled: DLintConfigFields = {
    layers: {},
    rules: {},
    defaultRules: [],
    ignorePatterns: [],
    parser: DLintConfigSchema.DEFAULT_PARSER,
    rootDir: __dirname,
  }
  expect(schema.fillDefaults(config, { configDir: __dirname })).toEqual(filled)
})

it('errors', () => {
  const schema = new DLintConfigSchema()
  const valid = schema.validate({})
  expect(valid).toBeFalsy()
  expect(schema.errors).toBeTruthy()
})
