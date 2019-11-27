type Field = string | string[]

export enum ConfigFieldTypes {
  STRING,
  STRING_LIST,
}

export interface ConfigField {
  type: ConfigFieldTypes
  required?: boolean
  default?: Field
}

export type SchemaDefinition<T extends {}> = {
  [P in keyof T]: ConfigField
}

const isTypeof = (value: unknown, type: ConfigFieldTypes) => {
  switch (type) {
    case ConfigFieldTypes.STRING:
      return typeof value === 'string'
    case ConfigFieldTypes.STRING_LIST:
      return (
        Array.isArray(value) && value.every((item) => typeof item === 'string')
      )
  }
}

const InvalidConfigError = (message: string) => {
  const err = new Error(message)
  err.name = 'InvalidConfigError'
  return err
}

export class ConfigSchema<T extends {}> {
  readonly definition: SchemaDefinition<T>

  constructor(schema: SchemaDefinition<T>) {
    this.definition = schema
  }

  validate(config: { [name: string]: unknown }): asserts config is T {
    const { definition } = this
    if (typeof config !== 'object' || config === null) {
      throw InvalidConfigError(
        `Config is expected to be object, but is "${typeof config}"`,
      )
    }
    for (const name in definition) {
      const { required, type } = definition[name]
      const value = config[name]
      if (required && value === undefined) {
        throw InvalidConfigError(`"${name}" field is required.`)
      }
      if (!isTypeof(value, type) && value !== undefined) {
        throw InvalidConfigError(
          `"${name}" field has invalid value ${JSON.stringify(value)}`,
        )
      }
    }
    for (const name in config) {
      if (!(name in definition)) {
        throw InvalidConfigError(`"${name}" field is invalid`)
      }
    }
  }

  fillDefaults(config: Partial<T>): T {
    const { definition } = this
    const filled = { ...config } as T
    for (const name in definition) {
      if (
        typeof config[name] === 'undefined' &&
        typeof definition[name] !== 'undefined'
      ) {
        Object.assign(filled, {
          [name]: definition[name].default,
        })
      }
    }
    return filled
  }
}
