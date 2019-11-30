import { promises as fs } from 'fs'

import { DLintConfigSchema, DLintConfig } from './core/DLintConfigSchema'

export class DLintConfigBuilder {
  static async fromJsonFile(path: string) {
    const json = await fs.readFile(path, 'utf-8')
    const config = JSON.parse(json)
    return DLintConfigBuilder.fromJSON(config)
  }

  static fromJSON(configObject: unknown): DLintConfig {
    const schema = new DLintConfigSchema()
    schema.validate(configObject as {})
    const config = schema.fillDefaults(configObject as {})
    return config
  }
}
