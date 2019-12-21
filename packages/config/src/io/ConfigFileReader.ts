import { promises as fs } from 'fs'
import { extname, join } from 'path'

import YAML from 'js-yaml'

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

export class ConfigFileReader {
  defaultFileNames: string[]

  constructor(options: ConfigFileReaderOptions) {
    this.defaultFileNames = options.defaultFileNames || []
  }

  async resolveConfigPath(path: string): Promise<string> {
    const stats = await fs.stat(path)
    if (stats.isDirectory()) {
      const { defaultFileNames } = this
      for (const fileName of defaultFileNames) {
        const filePath = join(path, fileName)
        const exists = await fileExists(filePath)
        if (exists) {
          return filePath
        }
      }
      throw new Error(
        `Not found any files of ${JSON.stringify(defaultFileNames)} in ${path}`,
      )
    }
    if (stats.isFile()) {
      const ext = extname(path)
      if (ext === '.yaml' || ext === '.yml' || ext === '.json') {
        return path
      } else {
        throw new Error(
          `Config file extension must .yml, .yaml, or .json: ${path}`,
        )
      }
    }
    throw new Error(`Not file or directory: ${path}`)
  }

  async fromPath(path: string): Promise<object> {
    const ext = extname(path)
    if (ext === '.yaml' || ext === '.yml') {
      return this.fromYamlFile(path)
    }
    if (ext === '.json') {
      return this.fromJsonFile(path)
    }
    throw new Error(`Config file must be JSON or YAML: ${path}`)
  }

  private async fromYamlFile(path: string) {
    const yaml = await fs.readFile(path, 'utf-8')
    const config = YAML.safeLoad(yaml)
    return config
  }

  private async fromJsonFile(path: string) {
    const json = await fs.readFile(path, 'utf-8')
    const config = JSON.parse(json)
    return config
  }
}
