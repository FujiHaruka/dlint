import { promises as fs } from 'fs'
import { extname } from 'path'

import YAML from 'js-yaml'

import { ConfigSchema } from '../core/ConfigSchema'

const fileExists = async (path: string) => {
  try {
    const stats = await fs.stat(path)
    return stats.isFile()
  } catch (e) {
    return false
  }
}

export interface ConfigFileReaderOptions {
  defaultFileNames?: string[]
}

export class ConfigFileReader<T extends {}> {
  Schema: new () => ConfigSchema<T>
  defaultFileNames: string[]

  constructor(
    Schema: new () => ConfigSchema<T>,
    options: ConfigFileReaderOptions,
  ) {
    this.Schema = Schema
    this.defaultFileNames = options.defaultFileNames || []
  }

  async fromFile(path: string): Promise<T> {
    const stats = await fs.stat(path)
    if (stats.isDirectory()) {
      const { defaultFileNames } = this
      for (const fileName of defaultFileNames) {
        const exists = await fileExists(fileName)
        if (exists) {
          return this.fromFile(fileName)
        }
      }
      throw new Error(
        `Not found any file of ${JSON.stringify(defaultFileNames)} in ${path}`,
      )
    }
    if (stats.isFile()) {
      const ext = extname(path)
      if (ext === '.yaml' || ext === '.yml' || ext) {
        return this.fromYamlFile(path)
      }
      if (ext === '.json') {
        return this.fromJsonFile(path)
      }
    }
    throw new Error(`Config file must be JSON or YAML: ${path}`)
  }

  async fromYamlFile(path: string) {
    const yaml = await fs.readFile(path, 'utf-8')
    const config = YAML.safeLoad(yaml)
    return this.fromObject(config)
  }

  async fromJsonFile(path: string) {
    const json = await fs.readFile(path, 'utf-8')
    const config = JSON.parse(json)
    return this.fromObject(config)
  }

  fromObject(configObject: object): T {
    const { Schema } = this
    const schema = new Schema()
    if (schema.validate(configObject)) {
      const filled = schema.fillDefaults(configObject)
      return filled
    } else {
      const { errors } = schema
      throw new Error(JSON.stringify(errors))
    }
  }
}
