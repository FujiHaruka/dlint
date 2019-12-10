import { Fanout } from '@dlint/layer/build/core/dep/DepNode'
import {
  LocalModule,
  PackageModule,
} from '@dlint/layer/build/core/module/DLintModule'
import { DLintLayer } from '@dlint/layer/build/core/layer/DLintLayer'

import { RuleUnitBase } from './RuleUnitBase'

export const RuleUnitNames = {
  AllowAll: 'AllowAll',
  AllowLayers: 'AllowLayers',
  AllowPackages: 'AllowPackages',
  DisallowAll: 'DisallowAll',
  DisallowLayers: 'DisallowLayers',
  DisallowPackages: 'DisallowPackages',
}

export class AllowAll extends RuleUnitBase {
  name = RuleUnitNames.AllowAll
  positive = true

  protected target(fanout: Fanout) {
    return [...fanout.locals, ...fanout.builtins, ...fanout.packages]
  }

  protected judge() {
    return true
  }
}

// --- allowing rule units

export class AllowLayers extends RuleUnitBase {
  name = RuleUnitNames.AllowLayers
  positive = true
  layers: DLintLayer[]

  constructor(layers: DLintLayer[]) {
    super()
    this.layers = layers
  }

  protected target(fanout: Fanout) {
    return fanout.locals
  }

  protected judge(module: LocalModule) {
    return this.layers.some((layer) => layer.has(module))
  }
}

export class AllowPackages extends RuleUnitBase {
  name = RuleUnitNames.AllowPackages
  positive = true
  packages: string[]

  constructor(packages: string[]) {
    super()
    this.packages = packages
  }

  protected target(fanout: Fanout) {
    return fanout.packages
  }

  protected judge(module: PackageModule) {
    return this.packages.includes(module.name)
  }
}

// --- disallowing rule units

export class DisallowAll extends AllowAll {
  name = RuleUnitNames.DisallowAll
  positive = false
}

export class DisallowLayers extends AllowLayers {
  name = RuleUnitNames.DisallowLayers
  positive = false
}

export class DisallowPackages extends AllowPackages {
  name = RuleUnitNames.DisallowPackages
  positive = false
}
