import Ajv from 'ajv'
import { DLintRuleExpression, ParserPackage } from '@dlint/core'

type PathPattern = string

export interface DLintConfigFields {
  defaultRules: DLintRuleExpression[]
  ignorePatterns: PathPattern[]
  layers: {
    [layerName: string]: PathPattern[]
  }
  parser: string
  rootDir: string
  rules: {
    [layerName: string]: DLintRuleExpression[]
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
  static DEFAULT_PARSER = ParserPackage.ACORN

  validateUsingAjv: Ajv.ValidateFunction

  constructor() {
    this.validateUsingAjv = new Ajv({ allErrors: true }).compile(JsonSchema)
  }

  validate(fields: object): fields is Partial<DLintConfigFields> {
    const valid = this.validateUsingAjv(fields) as boolean
    // TODO: domain specific logic
    return valid
  }

  fillDefaults(
    fields: Partial<DLintConfigFields>,
    options: { configDir: string },
  ): DLintConfigFields {
    const full = {} as DLintConfigFields
    // layer and rules has been validated
    full.layers = fields.layers || {}
    full.rules = fields.rules || {}
    full.defaultRules = fields.defaultRules || []
    full.ignorePatterns = fields.ignorePatterns || []
    full.rootDir = fields.rootDir || options.configDir
    full.parser = fields.parser || DLintConfigSchema.DEFAULT_PARSER
    return full
  }

  get errors() {
    return this.validateUsingAjv.errors
  }
}
