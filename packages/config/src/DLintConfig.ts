import { resolve, basename } from 'path'

import { DLintConfigSchema, DLintConfigFields } from './core/DLintConfigSchema'
import { ConfigFileIO } from './io/ConfigFileIO'

export class DLintConfig {
  static async read(filePath: string) {
    const config = new this(resolve(filePath))
    await config.init()
    return config
  }

  static Defaults = {
    PARSER: 'default',
  }

  filePath: string
  io: ConfigFileIO<DLintConfigFields>
  fields: DLintConfigFields

  private constructor(filePath: string) {
    this.filePath = filePath
    this.io = new ConfigFileIO<DLintConfigFields>(DLintConfigSchema)
    this.fields = {} as DLintConfigFields // late init
  }

  private async init() {
    const { filePath, io } = this
    const fields = await io.fromJsonFile(filePath)
    this.fields = fields
    if (!fields.rootDir) {
      this.fields.rootDir = basename(filePath)
    }
    if (!fields.parser) {
      this.fields.parser = DLintConfig.Defaults.PARSER
    }
  }
}
