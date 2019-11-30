import {
  SchemaDefinition,
  ConfigFieldTypes,
  ConfigSchema,
} from './ConfigSchema'

export interface DLintConfig {
  rootDir: string
  include: string[]
  exclude: string[]
  rules: string[]
  parser: string
}

const SchemaDefinition: SchemaDefinition<DLintConfig> = {
  rootDir: {
    type: ConfigFieldTypes.STRING,
  },
  include: {
    type: ConfigFieldTypes.STRING_LIST,
    required: true,
  },
  exclude: {
    type: ConfigFieldTypes.STRING_LIST,
    default: [],
  },
  rules: {
    type: ConfigFieldTypes.STRING_LIST,
    required: true,
  },
  parser: {
    type: ConfigFieldTypes.STRING,
  },
}

export class DLintConfigSchema extends ConfigSchema<DLintConfig> {
  constructor() {
    super(SchemaDefinition)
  }

  validate(config: {}): config is DLintConfig {
    super.validate(config)
    // TODO: domain specific validation
    return true
  }
}
