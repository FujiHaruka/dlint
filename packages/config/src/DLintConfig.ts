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
    PARSER: 'default',
    DEFAULT_CONFIG_FILES: ['dlint-rules.yaml', 'dlint-rules.yml'],
  }

  filePath: string
  io: ConfigFileReader<DLintConfigFields>
  fields: DLintConfigFields

  private constructor(filePath: string) {
    this.filePath = filePath
    this.io = new ConfigFileReader<DLintConfigFields>(DLintConfigSchema, {
      defaultFileNames: DLintConfig.Defaults.DEFAULT_CONFIG_FILES,
    })
    this.fields = {} as DLintConfigFields // late init
  }

  private async init() {
    const { filePath, io } = this
    const fields = await io.fromJsonFile(filePath)
    this.fields = fields
    // FIXME: ここで default を埋めるのはよくない
    if (!fields.rootDir) {
      this.fields.rootDir = basename(filePath)
    }
    if (!fields.parser) {
      this.fields.parser = DLintConfig.Defaults.PARSER
    }
  }
}
