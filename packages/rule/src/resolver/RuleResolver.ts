import { DLintLayer } from '@dlint/layer/build/core/layer/DLintLayer'

import {
  AllowAll,
  AllowPackages,
  AllowLayers,
  DisallowAll,
  DisallowPackages,
  DisallowLayers,
} from '../core/RuleUnits'

export enum RuleAction {
  ALLOW = 'allow',
  DISALLOW = 'disallow',
}

export enum RuleTarget {
  ALL = 'all',
  ALL_PACKAGES = 'allPackages',
  ALL_LAYERS = 'allLayers',
  ALL_NODEJS = 'allNodejs',
  PACKAGES = 'packages',
  LAYERS = 'layers',
}

const RuleTargets = new Set(Object.values(RuleTarget))

interface AllowingExpression {
  allow: string
  on?: string[]
}

interface DisallowingExpression {
  disallow: string
  on?: string[]
}

export type RuleExpression = AllowingExpression | DisallowingExpression

export class RuleResolver {
  layers: Map<string, DLintLayer>

  constructor(layers: Map<string, DLintLayer>) {
    this.layers = layers
  }

  resolve(expression: RuleExpression) {
    const { positive, target, args } = this.validate(expression)
    switch (target) {
      case RuleTarget.ALL: {
        return positive ? new AllowAll() : new DisallowAll()
      }
      case RuleTarget.ALL_PACKAGES: {
        return positive ? new AllowAllPackages() : new DisallowAllPackages()
      }
      case RuleTarget.ALL_LAYERS: {
        return positive ? new AllowAllLayers() : new DisallowAllLayers()
      }
      case RuleTarget.ALL_NODEJS: {
        // TODO:
        // return positive ? new AllowAllNodejs() : new DisallowAllNodejs()
        return
      }
      case RuleTarget.PACKAGES: {
        return positive ? new AllowPackages(args) : new DisallowPackages(args)
      }
      case RuleTarget.LAYERS: {
        return positive ? new AllowLayers(args) : new DisallowLayers(args)
      }
      default:
        throw new Error('never')
    }
  }

  validate(expression: RuleExpression) {
    const isAllowing = RuleAction.ALLOW in expression
    const isDisallowing = RuleAction.DISALLOW in expression
    if (isAllowing && isDisallowing) {
      throw new Error(
        `Can use only one of "allow" and "disallow": ${JSON.stringify(
          expression,
        )}`,
      )
    }
    if (!isAllowing && !isAllowing) {
      throw new Error(
        `Must use one of "allow" and "disallow": ${JSON.stringify(expression)}`,
      )
    }
    const target = isAllowing
      ? ((expression as AllowingExpression).allow as RuleTarget)
      : ((expression as DisallowingExpression).disallow as RuleTarget)
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
