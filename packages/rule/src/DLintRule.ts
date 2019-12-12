import { strict as assert } from 'assert'

import { DLintLayer } from '@dlint/layer/build/core/layer/DLintLayer'

import { RuleExpression, RuleResolver } from './resolver/RuleResolver'
import { reduceDisallowedResults } from './core/RuleAppliedResult'

type LayerName = string

export class DLintRule {
  expressionsMap: Map<LayerName, RuleExpression[]>
  layers: Map<LayerName, DLintLayer>

  constructor(
    expressionsMap: Map<string, RuleExpression[]>,
    layers: Map<string, DLintLayer>,
  ) {
    this.expressionsMap = expressionsMap
    this.layers = layers
    this.validateInit()
  }

  apply(layer: DLintLayer) {
    const { expressionsMap, layers } = this
    if (layers.has(layer.name)) {
      throw new Error(`Layer "${layer.name}" not found in DLintRule`)
    }
    const expressions = expressionsMap.get(layer.name) || []
    const units = expressions.map((exp) =>
      new RuleResolver(layers).resolve(exp),
    )
    const disallowed = layer.nodes.map((node) => {
      const results = units.map((unit) => unit.apply(node))
      return reduceDisallowedResults(node, results)
    })
    return disallowed
  }

  private validateInit() {
    const { layers } = this
    for (const layerName of layers.keys()) {
      const layer = layers.get(layerName)
      assert.equal(
        layerName,
        layer?.name,
        `Key "${layerName}" in layers is not name for layer ${JSON.stringify(
          layer,
        )}`,
      )
    }
    for (const layerName of this.expressionsMap.keys()) {
      assert.ok(
        layers.has(layerName),
        `Layer name "${layerName}" in expressionMap is not found in layers`,
      )
    }
  }
}
