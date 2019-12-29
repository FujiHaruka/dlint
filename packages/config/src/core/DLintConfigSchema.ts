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

const LAYER_NAME_PATTERN = '^.+$'

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
        [LAYER_NAME_PATTERN]: {
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
        [LAYER_NAME_PATTERN]: {
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
  customErrors: ValidationError[] = []
  done = false

  constructor() {
    this.ajv = new Ajv({ allErrors: true })
    this.validateWithAjv = this.ajv.compile(JsonSchema)
  }

  validate(fields: object): fields is Partial<DLintConfigFields> {
    if (this.done) {
      throw new Error(`validate() can not be called twice`)
    }
    const valid = [
      this.validateWithAjv(fields) as boolean,
      this.validateLayerRuleRelation(fields),
      this.valildateRulesCount(fields),
    ].every(Boolean)
    this.done = true
    return valid
  }

  /**
   * Validate that all .layers keys equal .rules keys.
   */
  private validateLayerRuleRelation(
    fields: Partial<DLintConfigFields>,
  ): boolean {
    const layers = Object.keys(fields.layers || {})
    const ruleLayers = Object.keys(fields.rules || {})
    const layersNotInRules = layers.filter(
      (layer) => !ruleLayers.includes(layer),
    )
    this.customErrors = this.customErrors.concat(
      layersNotInRules.map((layer) => ({
        dataPath: `.layers['${layer}']`,
        message: 'should have the rule which corresponds to the layer',
      })),
    )
    const layersOnlyInRules = ruleLayers.filter(
      (layer) => !layers.includes(layer),
    )
    this.customErrors = this.customErrors.concat(
      layersOnlyInRules.map((layer) => ({
        dataPath: `.rules['${layer}']`,
        message: 'should have the layer which corresponds to the rule',
      })),
    )
    return layersNotInRules.length === 0 && layersOnlyInRules.length === 0
  }

  /**
   * Validate that each layer has at least one rule.
   */
  private valildateRulesCount(fields: Partial<DLintConfigFields>) {
    const defaultRules = fields.defaultRules || []
    if (defaultRules.length > 0) {
      return true
    }
    const rules = fields.rules || {}
    let valid = true
    for (const [layer, ruleExpressions] of Object.entries(rules)) {
      if ((ruleExpressions || []).length === 0) {
        valid = false
        this.customErrors.push({
          dataPath: `.rules['${layer}']`,
          message: `should has at least one rule, or "defaultRules" field are required`,
        })
      }
    }
    return valid
  }

  fillDefaults(
    fields: Partial<DLintConfigFields>,
    options: { configDir: string },
  ): DLintConfigFields {
    const full = {} as DLintConfigFields
    // layer and rules has been validated
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    full.layers = fields.layers!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    full.rules = fields.rules!
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
    const errors = ((this.validateWithAjv.errors ||
      []) as ValidationError[]).concat(this.customErrors)
    return errors.length === 0 ? null : errors
  }
}
