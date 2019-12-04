import Ajv from 'ajv'

enum RuleTargets {
  ALL_LAYERS = 'allLayers',
  ALL_PACKAGES = 'allPackages',
  ALL_NODEJS = 'allNodejs',
  LAYERS = 'layers',
  PACKAGES = 'packages',
}

type Rule =
  | {
      allow: RuleTargets
      on?: string[]
    }
  | {
      disallow: RuleTargets
      on?: string[]
    }

type PathPattern = string

export interface DLintConfigFields {
  defaultRules: Rule[]
  ignorePatterns: PathPattern[]
  layers: {
    [layerName: string]: PathPattern[]
  }
  parser: string
  rootDir: string
  rules: {
    [layerName: string]: Rule[]
  }
}

const JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  properties: {
    defaultRules: {
      type: 'array',
      items: {
        $ref: '#/definitions/rule',
      },
    },
    ignorePatterns: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    layers: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^[a-zA-Z0-9_-]+$': {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
    parser: {
      type: 'string',
    },
    rootDir: {
      type: 'string',
    },
    rules: {
      type: 'object',
      additionalProperties: false,
      patternProperties: {
        '^[a-zA-Z0-9_-]+$': {
          type: 'array',
          items: {
            $ref: '#/definitions/rule',
          },
        },
      },
    },
  },
  required: ['layers', 'rules'],
  title: 'DLintConfig',
  type: 'object',
  definitions: {
    rule: {
      type: 'object',
      additionalProperties: false,
      properties: {
        allow: {
          type: 'string',
        },
        disallow: {
          type: 'string',
        },
        on: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  },
}

export class DLintConfigSchema {
  validateUsingAjv: Ajv.ValidateFunction

  constructor() {
    this.validateUsingAjv = new Ajv({ allErrors: true }).compile(JsonSchema)
  }

  validate(schema: object) {
    const valid = this.validateUsingAjv(schema)
    return valid
  }

  get errors() {
    return this.validateUsingAjv.errors
  }
}
