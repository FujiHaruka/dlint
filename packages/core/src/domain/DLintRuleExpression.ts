import { RuleTarget } from '../enum/RuleTarget'

interface AllowingExpression {
  allow: RuleTarget
  on?: string[]
}

interface DisallowingExpression {
  disallow: RuleTarget
  on?: string[]
}

export type DLintRuleExpression = AllowingExpression | DisallowingExpression
