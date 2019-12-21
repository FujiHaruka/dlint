import { DLintLayer } from '@dlint/core'

import { RuleResolver } from './resolver/RuleResolver'
import { reduceDisallowedResults } from './core/RuleAppliedResult'
import { LayerRuleBindings, LayerRuleBinding } from './core/LayerRuleBindings'

export { LayerRuleBinding } from './core/LayerRuleBindings'

export class DLintRule {
  bindings: LayerRuleBindings

  constructor(bindings: LayerRuleBinding[]) {
    this.bindings = new LayerRuleBindings(bindings)
  }

  apply(layer: DLintLayer) {
    const { bindings } = this
    const { layers } = bindings
    if (!layers.has(layer.name)) {
      throw new Error(`Layer "${layer.name}" not found in DLintRule`)
    }
    const expressions = bindings.expressionFor(layer)
    const units = expressions.map((exp) =>
      new RuleResolver(layers).resolve(exp),
    )
    const disallowed = layer.nodes
      .map((node) => {
        const results = units.map((unit) => unit.apply(node))
        return reduceDisallowedResults(layer, node, results)
      })
      .filter(({ statuses }) => statuses.length > 0)
    return disallowed
  }
}
