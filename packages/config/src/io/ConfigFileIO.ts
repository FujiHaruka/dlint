import { promises as fs } from 'fs'

import { ConfigSchema } from '../core/ConfigSchema'

// FIXME
export class ConfigFileIO<T> {
  Schema: new () => ConfigSchema<T>

  constructor(Schema: new () => ConfigSchema<T>) {
    this.Schema = Schema
  }

  async fromJsonFile(path: string) {
    const json = await fs.readFile(path, 'utf-8')
    const config = JSON.parse(json)
    return this.fromObject(config)
  }

  fromObject(configObject: unknown): T {
    const { Schema } = this
    const schema = new Schema()
    schema.validate(configObject as {})
    const config = schema.fillDefaults(configObject as {})
    return config
  }
}
