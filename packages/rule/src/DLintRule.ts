import { DLintLayer } from '@dlint/core'

import { RuleResolver } from './resolver/RuleResolver'
import { reduceDisallowedResults } from './core/RuleAppliedResult'
import {
  LayerExpressionsRelations,
  LayerExpressions,
} from './core/LayerExpressions'

export { LayerExpressions } from './core/LayerExpressions'

export class DLintRule {
  relations: LayerExpressionsRelations

  constructor(relations: LayerExpressions[]) {
    this.relations = new LayerExpressionsRelations(relations)
  }

  apply(layer: DLintLayer) {
    const { relations } = this
    const { layers } = relations
    if (!layers.has(layer.name)) {
      throw new Error(`Layer "${layer.name}" not found in DLintRule`)
    }
    const expressions = relations.expressionFor(layer)
    const units = expressions.map((exp) =>
      new RuleResolver(layers).resolve(exp),
    )
    const disallowed = layer.nodes.map((node) => {
      const results = units.map((unit) => unit.apply(node))
      return reduceDisallowedResults(node, results)
    })
    return disallowed
  }
}
