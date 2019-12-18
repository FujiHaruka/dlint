import { DLintModule, DLintNode, Fanout, RuleUnitName } from '@dlint/core'

import { NodeAppliedResult } from './RuleAppliedResult'

export interface RuleUnit {
  name: RuleUnitName
  apply(node: DLintNode): NodeAppliedResult
}

export class RuleUnitBase implements RuleUnit {
  name = 'Base' as RuleUnitName
  protected positive = true

  apply(node: DLintNode) {
    const result = new NodeAppliedResult(node, this.name)
    for (const module of this.target(node.fanout)) {
      if (this.judge(module)) {
        if (this.positive) {
          result.allow(module)
        } else {
          result.disallow(module)
        }
      }
    }
    return result
  }

  // must be overroded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected target(fanout: Fanout): DLintModule[] {
    throw new Error('Not implemented')
  }

  // must be overrode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected judge(module: DLintModule): boolean {
    throw new Error('Not implemented')
  }
}
