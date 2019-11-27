export enum ConfigFieldTypes {
  STRING,
  STRING_LIST,
}

export interface ConfigField {
  type: ConfigFieldTypes
  required?: boolean
  default?: string | string[]
}

export interface ConfigSchema<T> {
  [name: string]: ConfigField
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

type ValidateConfig<T extends {}> = (config: {
  [name: string]: unknown
}) => asserts config is T

export class ConfigValidator<T extends {}> {
  schema: ConfigSchema<T>

  constructor(schema: ConfigSchema<T>) {
    this.schema = schema
  }

  validate(config: { [name: string]: unknown }): asserts config is T {
    const { schema } = this
    if (typeof config !== 'object' || config === null) {
      throw InvalidConfigError(
        `Config is expected to be object, but is "${typeof config}"`,
      )
    }
    for (const name of Object.keys(schema)) {
      const { required, type } = schema[name]
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
    for (const name of Object.keys(config)) {
      if (!schema[name]) {
        throw InvalidConfigError(`"${name}" field is invalid`)
      }
    }
  }
}
