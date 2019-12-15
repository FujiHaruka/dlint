import { RuleTarget } from '../enum/RuleTarget'

export interface AllowingExpression {
  allow: RuleTarget
  on?: string[]
}

export interface DisallowingExpression {
  disallow: RuleTarget
  on?: string[]
}

export type DLintRuleExpression = AllowingExpression | DisallowingExpression
