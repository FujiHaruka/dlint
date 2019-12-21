import { RuleUnitName } from '../enum/RuleUnitName'

import { DLintNode } from './DLintNode'
import { DLintModule } from './DLintModule'
import { DLintLayer } from './DLintLayer'

export interface DLintError {
  layer: DLintLayer
  node: DLintNode
  statuses: {
    ruleUnitName: RuleUnitName
    module: DLintModule
  }[]
}
