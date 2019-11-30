import {
  SchemaDefinition,
  ConfigFieldTypes,
  ConfigSchema,
} from './ConfigSchema'

export interface DLintConfigFields {
  rootDir: string
  include: string[]
  exclude: string[]
  rules: string[]
  parser: string
}

const SchemaDefinition: SchemaDefinition<DLintConfigFields> = {
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

export class DLintConfigSchema extends ConfigSchema<DLintConfigFields> {
  constructor() {
    super(SchemaDefinition)
  }

  validate(config: {}): config is DLintConfigFields {
    super.validate(config)
    // TODO: domain specific validation
    return true
  }
}
