import { promises as fs } from 'fs'
import { join } from 'path'

import yaml from 'js-yaml'

import { DLintConfigSchema } from '../../../src/core/DLintConfigSchema'

it('works', async () => {
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
})
