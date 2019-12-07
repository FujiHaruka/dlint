import { resolve, basename } from 'path'

import { DLintConfigSchema, DLintConfigFields } from './core/DLintConfigSchema'
import { ConfigFileReader } from './io/ConfigFileReader'

export class DLintConfig {
  static async read(path: string) {
    const config = new this(resolve(path))
    await config.init()
    return config
  }

  static Defaults = {
    DEFAULT_CONFIG_FILES: ['dlint-rules.yaml', 'dlint-rules.yml'],
  }

  filePath: string
  reader: ConfigFileReader
  schema: DLintConfigSchema
  fields: DLintConfigFields

  private constructor(filePath: string) {
    this.filePath = filePath
    this.reader = new ConfigFileReader({
      defaultFileNames: DLintConfig.Defaults.DEFAULT_CONFIG_FILES,
    })
    this.schema = new DLintConfigSchema()
    this.fields = {} as DLintConfigFields // late init
  }

  private async init() {
    const { filePath, reader, schema } = this
    const partial = await reader.fromPath(filePath)
    if (schema.validate(partial)) {
      const fields = schema.fillDefaults(partial, {
        configDir: basename(filePath),
      })
      this.fields = fields
    } else {
      throw new Error(JSON.stringify(schema.errors))
    }
  }
}
