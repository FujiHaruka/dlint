import { DLintConfig } from '@dlint/config'
import { DLintLayer } from '@dlint/layer'
import { DLintRule, LayerRuleBinding } from '@dlint/rule'

export class DLint {
  layers: DLintLayer[]
  rule: DLintRule

  private constructor(layers: DLintLayer[], rule: DLintRule) {
    this.layers = layers
    this.rule = rule
  }

  static async init(configPath: string) {
    const config = await DLintConfig.load(configPath)
    const rules = config.rules()
    const { expressions, options } = config.layers()
    const layers = await Promise.all(
      expressions.map(({ name, patterns }) =>
        DLintLayer.gatherDeps(name, patterns, options),
      ),
    )
    const bindings: LayerRuleBinding[] = layers.map((layer) => ({
      layer,
      expressions: rules[layer.name] || [],
    }))
    const rule = new DLintRule(bindings)
    const lint = new this(layers, rule)
    return lint
  }

  run() {
    const { rule, layers } = this
    const disallowed = layers.map((layer) => rule.apply(layer))
    return disallowed
  }
}
