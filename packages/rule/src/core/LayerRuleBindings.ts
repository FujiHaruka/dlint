import { DLintLayer, DLintRuleExpression } from '@dlint/core'

type LayerName = string

export interface LayerRuleBinding {
  layer: DLintLayer
  expressions: DLintRuleExpression[]
}

export class LayerRuleBindings {
  readonly expressions: Map<LayerName, DLintRuleExpression[]>
  readonly layers: Map<LayerName, DLintLayer>

  constructor(bidings: LayerRuleBinding[]) {
    this.validate(bidings)
    this.layers = new Map(bidings.map(({ layer }) => [layer.name, layer]))
    this.expressions = new Map(
      bidings.map(({ layer, expressions }) => [layer.name, expressions]),
    )
  }

  expressionFor(layer: DLintLayer) {
    return this.expressions.get(layer.name) || []
  }

  private validate(bidings: LayerRuleBinding[]) {
    const layers = bidings.map(({ layer }) => layer)
    const nameDuplicated = layers.find(
      (layer, i) => layers.findIndex(({ name }) => name === layer.name) !== i,
    )
    if (nameDuplicated) {
      throw new Error(
        `Found duplicated name in layers: "${nameDuplicated.name}"`,
      )
    }
  }
}
