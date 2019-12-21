import { resolve } from 'path'

import Ajv from 'ajv'
import { DLintRuleExpression, ParserPackage } from '@dlint/core'

type PathPattern = string

export interface DLintConfigFields {
  defaultRules: DLintRuleExpression[]
  ignorePatterns: PathPattern[]
  layers: {
    [layerName: string]: PathPattern[]
  }
  parser: ParserPackage
  rootDir: string
  rules: {
    [layerName: string]: DLintRuleExpression[]
  }
}

export interface ValidationError {
  dataPath: string
  message: string
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
          type: ['array', 'null'],
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

  ajv: Ajv.Ajv
  validateWithAjv: Ajv.ValidateFunction

  constructor() {
    this.ajv = new Ajv({ allErrors: true })
    this.validateWithAjv = this.ajv.compile(JsonSchema)
  }

  validate(fields: object): fields is Partial<DLintConfigFields> {
    const valid = this.validateWithAjv(fields) as boolean
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
    for (const name of Object.keys(full.rules)) {
      full.rules[name] = full.rules[name] || []
    }
    full.defaultRules = fields.defaultRules || []
    full.ignorePatterns = fields.ignorePatterns || []
    full.rootDir = resolve(options.configDir, fields.rootDir || '.')
    full.parser = fields.parser || DLintConfigSchema.DEFAULT_PARSER
    return full
  }

  get errors() {
    const errors = (this.validateWithAjv.errors || []) as ValidationError[]
    return errors.length === 0 ? null : errors
  }
}
