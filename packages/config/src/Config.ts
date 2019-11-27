import { promises as fs } from 'fs'

import { DLintConfigSchema } from './core/DLintConfigSchema'

export class DlintConfigBuilder {
  static async fromFile(path: string) {
    const json = await fs.readFile(path, 'utf-8')
    const config = JSON.parse(json)
    return DlintConfigBuilder.fromJSON(config)
  }

  static fromJSON(configObject: unknown) {
    const schema = new DLintConfigSchema()
    schema.validate(configObject as {})
    const config = schema.fillDefaults(configObject as {})
    return config
  }
}
