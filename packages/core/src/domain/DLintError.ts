import { RuleUnitName } from '../enum/RuleUnitName'

import { DLintNode } from './DLintNode'
import { DLintModule } from './DLintModule'

export interface DLintError {
  node: DLintNode
  statuses: {
    ruleUnitName: RuleUnitName
    module: DLintModule
  }[]
}
