import { DLintLayer, DLintRuleExpression } from '@dlint/core'

type LayerName = string

export interface LayerExpressions {
  layer: DLintLayer
  expressions: DLintRuleExpression[]
}

export class LayerExpressionsRelations {
  readonly expressions: Map<LayerName, DLintRuleExpression[]>
  readonly layers: Map<LayerName, DLintLayer>

  constructor(relations: LayerExpressions[]) {
    this.validateRelations(relations)
    this.layers = new Map(relations.map(({ layer }) => [layer.name, layer]))
    this.expressions = new Map(
      relations.map(({ layer, expressions }) => [layer.name, expressions]),
    )
  }

  expressionFor(layer: DLintLayer) {
    return this.expressions.get(layer.name) || []
  }

  private validateRelations(relations: LayerExpressions[]) {
    const layers = relations.map(({ layer }) => layer)
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
