import { DLintLayer } from '@dlint/layer/build/core/layer/DLintLayer'

import { RuleUnit } from './RuleUnitBase'

type RuleAppliedResult = {
  // todo
}

export interface Rule {
  append(units: RuleUnit[]): void
  applyTo(layer: DLintLayer): RuleAppliedResult
}
