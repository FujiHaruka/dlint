import {
  DLintLayer,
  RuleTarget,
  RuleAction,
  DLintRuleExpression,
  AllowingExpression,
  DisallowingExpression,
} from '@dlint/core'

import {
  AllowAll,
  AllowAllLayers,
  AllowAllPackages,
  AllowAllNodejs,
  AllowAllJson,
  AllowLayers,
  AllowPackages,
  DisallowAll,
  DisallowAllLayers,
  DisallowAllPackages,
  DisallowAllNodejs,
  DisallowAllJson,
  DisallowLayers,
  DisallowPackages,
} from '../core/RuleUnits'
import { RuleUnit } from '../core/RuleUnitBase'

const RuleTargets = new Set(Object.values(RuleTarget))

function assertArgs(
  target: RuleTarget,
  args?: string[] | undefined,
): asserts args {
  if (!args) {
    throw new Error(`"on" field is required for "${target}" rule`)
  }
}
function warnIfArgs(target: RuleTarget, args?: string[]) {
  if (args) {
    console.warn(`"on" field is meaningless for "${target}" rule`)
  }
}

export class RuleResolver {
  layers: Map<string, DLintLayer>

  constructor(layers: Map<string, DLintLayer>) {
    this.layers = layers
  }

  resolve(expression: DLintRuleExpression): RuleUnit {
    const { positive, target, args } = this.validate(expression)
    switch (target) {
      case RuleTarget.ALL: {
        warnIfArgs(target, args)
        return positive ? new AllowAll() : new DisallowAll()
      }
      case RuleTarget.ALL_LAYERS: {
        warnIfArgs(target, args)
        return positive ? new AllowAllLayers() : new DisallowAllLayers()
      }
      case RuleTarget.ALL_PACKAGES: {
        warnIfArgs(target, args)
        return positive ? new AllowAllPackages() : new DisallowAllPackages()
      }
      case RuleTarget.ALL_NODEJS: {
        warnIfArgs(target, args)
        return positive ? new AllowAllNodejs() : new DisallowAllNodejs()
      }
      case RuleTarget.ALL_JSON: {
        warnIfArgs(target, args)
        return positive ? new AllowAllJson() : new DisallowAllJson()
      }
      case RuleTarget.LAYERS: {
        assertArgs(target, args)
        const invalidLayerName = args.find((name) => !this.layers.has(name))
        if (invalidLayerName) {
          throw new Error(`Layer name "${invalidLayerName}" is invalid`)
        }
        const layers = args
          .map((name) => this.layers.get(name))
          .filter((layer): layer is DLintLayer => Boolean(layer))
        return positive ? new AllowLayers(layers) : new DisallowLayers(layers)
      }
      case RuleTarget.PACKAGES: {
        assertArgs(target, args)
        return positive ? new AllowPackages(args) : new DisallowPackages(args)
      }
      default:
        throw new Error('never')
    }
  }

  validate(expression: DLintRuleExpression) {
    const isAllowing = RuleAction.ALLOW in expression
    const isDisallowing = RuleAction.DISALLOW in expression
    if (isAllowing && isDisallowing) {
      throw new Error(
        `Can use only one of "allow" and "disallow": ${JSON.stringify(
          expression,
        )}`,
      )
    }
    if (!isAllowing && !isDisallowing) {
      throw new Error(
        `Must use one of "allow" and "disallow": ${JSON.stringify(expression)}`,
      )
    }
    const target = isAllowing
      ? (expression as AllowingExpression).allow
      : (expression as DisallowingExpression).disallow
    if (!RuleTargets.has(target)) {
      throw new Error(`Invalid rule target name: ${target}`)
    }
    return {
      positive: isAllowing,
      target,
      args: expression.on,
    }
  }
}
