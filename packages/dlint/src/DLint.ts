import { DLintConfig } from '@dlint/config'
import { DLintLayer } from '@dlint/layer'
import { DLintRule, LayerRuleBinding } from '@dlint/rule'
// FIXME
import { DisallowedResult } from '@dlint/rule/build/core/RuleAppliedResult'

const loadLayers = async (config: DLintConfig) => {
  const { expressions, options } = config.layers()
  const layers = await Promise.all(
    expressions.map(({ name, patterns }) =>
      DLintLayer.gatherDeps(name, patterns, options),
    ),
  )
  return layers
}
const bindRule = (config: DLintConfig, layers: DLintLayer[]) => {
  const rules = config.rules()
  const bindings: LayerRuleBinding[] = layers.map((layer) => ({
    layer,
    expressions: rules[layer.name] || [],
  }))
  const rule = new DLintRule(bindings)
  return rule
}

export class DLint {
  layers: DLintLayer[]
  rule: DLintRule

  private constructor(layers: DLintLayer[], rule: DLintRule) {
    this.layers = layers
    this.rule = rule
  }

  static async init(configPath: string) {
    const config = await DLintConfig.load(configPath)
    const layers = await loadLayers(config)
    const rule = bindRule(config, layers)
    const lint = new this(layers, rule)
    return lint
  }

  applyRule(): DisallowedResult[] {
    const { rule, layers } = this
    const disallowed = layers.map((layer) => rule.apply(layer)).flat()
    return disallowed
  }
}
