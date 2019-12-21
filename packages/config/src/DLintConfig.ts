import { EOL } from 'os'
import { resolve, dirname } from 'path'

import { DLintRuleExpression } from '@dlint/core'

import { DLintConfigSchema, DLintConfigFields } from './core/DLintConfigSchema'
import { ConfigFileReader } from './io/ConfigFileReader'
import { formatAjvErrors } from './formatter/ErrorFormatter'

export class DLintConfig {
  /**
   * Load DLint rules config file
   * @param path - project directory or config file path
   */
  static async load(path: string) {
    const config = new this()
    await config.init(path)
    return config
  }

  static Defaults = {
    DEFAULT_CONFIG_FILES: ['dlint-rules.yaml', 'dlint-rules.yml'],
  }

  configPath: string
  fields: DLintConfigFields
  private reader: ConfigFileReader
  private schema: DLintConfigSchema

  private constructor() {
    this.configPath = '' // late init
    this.reader = new ConfigFileReader({
      defaultFileNames: DLintConfig.Defaults.DEFAULT_CONFIG_FILES,
    })
    this.schema = new DLintConfigSchema()
    this.fields = {} as DLintConfigFields // late init
  }

  layers() {
    const { layers, ignorePatterns, rootDir, parser } = this.fields
    const options = {
      rootDir,
      ignorePatterns,
      parser,
    }
    return {
      expressions: Object.entries(layers).map(([name, patterns]) => ({
        name,
        patterns,
      })),
      options,
    }
  }

  rules() {
    const { defaultRules, rules: rawRules } = this.fields
    const rules: typeof rawRules = Object.fromEntries(
      Object.entries(rawRules).map(
        ([layerName, expressions]) =>
          [layerName, [...defaultRules, ...expressions]] as [
            string,
            DLintRuleExpression[],
          ],
      ),
    )
    return rules
  }

  private async init(path: string) {
    const { reader, schema } = this
    const configPath = await reader.resolveConfigPath(resolve(path))
    this.configPath = configPath

    const partial = await reader.fromPath(configPath)
    if (schema.validate(partial)) {
      const fields = schema.fillDefaults(partial, {
        configDir: dirname(configPath),
      })
      this.fields = fields
    } else {
      throw new Error(formatAjvErrors(this.configPath, schema.errors || []))
    }
  }
}
