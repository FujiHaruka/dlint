import { DLintLayer } from '@dlint/layer/build/core/layer/DLintLayer'

import {
  AllowAll,
  AllowAllLayers,
  AllowAllPackages,
  AllowLayers,
  AllowPackages,
  DisallowAll,
  DisallowAllLayers,
  DisallowAllPackages,
  DisallowLayers,
  DisallowPackages,
} from '../core/RuleUnits'

export enum RuleAction {
  ALLOW = 'allow',
  DISALLOW = 'disallow',
}

export enum RuleTarget {
  ALL = 'all',
  ALL_LAYERS = 'allLayers',
  ALL_PACKAGES = 'allPackages',
  ALL_NODEJS = 'allNodejs',
  LAYERS = 'layers',
  PACKAGES = 'packages',
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
      case RuleTarget.ALL_LAYERS: {
        return positive ? new AllowAllLayers() : new DisallowAllLayers()
      }
      case RuleTarget.ALL_PACKAGES: {
        return positive ? new AllowAllPackages() : new DisallowAllPackages()
      }
      case RuleTarget.ALL_NODEJS: {
        // TODO:
        // return positive ? new AllowAllNodejs() : new DisallowAllNodejs()
        return
      }
      case RuleTarget.LAYERS: {
        if (!args) {
          throw new Error(`"on" is required for "layers" rule`)
        }
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
        if (!args) {
          throw new Error(`"on" is required for "packages" rule`)
        }
        return positive ? new AllowPackages(args) : new DisallowPackages(args)
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
