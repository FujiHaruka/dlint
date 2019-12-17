import { DLintNode } from './DLintNode'
import { DLintModule } from './DLintModule'

export interface DLintError {
  node: DLintNode
  statuses: {
    ruleUnitName: string
    module: DLintModule
  }[]
}
