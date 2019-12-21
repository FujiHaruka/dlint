import { promises as fs } from 'fs'
import { join, resolve } from 'path'

import yaml from 'js-yaml'

import {
  DLintConfigSchema,
  DLintConfigFields,
  ValidationError,
} from '../../../src/core/DLintConfigSchema'

const testInvalidConfig = async (
  configFile: string,
  match: Partial<ValidationError>,
) => {
  const config = yaml.safeLoad(
    await fs.readFile(
      join(__dirname, '../../fixtures/configs', configFile),
      'utf-8',
    ),
  )
  const schema = new DLintConfigSchema()
  const valid = schema.validate(config)
  expect(valid).toBeFalsy()
  expect((schema.errors || [])[0]).toMatchObject(match)
}

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

it('valid 01: rule fields allow null', async () => {
  const config = yaml.safeLoad(
    await fs.readFile(
      join(__dirname, '../../fixtures/configs/valid01.yml'),
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

it('invalid 01: additional field', async () => {
  await testInvalidConfig('invalid01.yml', {
    message: 'should NOT have additional properties',
  })
})

it('invalid 02: layer with no correspoinding rule', async () => {
  await testInvalidConfig('invalid02.yml', {
    dataPath: ".layers['layer2']",
  })
})

it('invalid 03: layer in rule with no corresponding layer', async () => {
  await testInvalidConfig('invalid03.yml', {
    dataPath: ".rules['layer2']",
  })
})

it('invalid 04: every layer has at least one rule', async () => {
  await testInvalidConfig('invalid04.yml', {
    dataPath: ".rules['layer1']",
  })
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

it('can not call validate() twice', () => {
  const schema = new DLintConfigSchema()
  schema.validate({})
  expect(() => schema.validate({})).toThrow()
})
