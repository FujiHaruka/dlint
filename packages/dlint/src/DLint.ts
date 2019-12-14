import { DLintConfig } from '@dlint/config'
import { DLintConfigFields } from '@dlint/config/build/core/DLintConfigSchema'

export class DLint {
  config: DLintConfigFields

  private constructor(config: DLintConfigFields) {
    this.config = config
  }

  static async init(configPath: string) {
    const config = await DLintConfig.load(configPath)
    const self = new this(config.fields)
    return self
  }
}
