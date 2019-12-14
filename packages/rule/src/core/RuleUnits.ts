import { Fanout } from '@dlint/layer/build/core/dep/DepNode'
import {
  LocalModule,
  PackageModule,
} from '@dlint/layer/build/core/module/DLintModule'
import { DLintLayer } from '@dlint/layer/build/core/layer/DLintLayer'

import { RuleUnitBase } from './RuleUnitBase'

export const RuleUnitNames = {
  AllowAll: 'AllowAll',
  AllowAllLayers: 'AllowAllLayers',
  AllowAllPackages: 'AllowAllPackages',
  AllowAllNodejs: 'AllowAllNodejs',
  AllowLayers: 'AllowLayers',
  AllowPackages: 'AllowPackages',
  DisallowAll: 'DisallowAll',
  DisallowAllLayers: 'DisallowAllLayers',
  DisallowAllPackages: 'DisallowAllPackages',
  DisallowAllNodejs: 'DisallowAllNodejs',
  DisallowLayers: 'DisallowLayers',
  DisallowPackages: 'DisallowPackages',
}

// --- allowing rule units

export class AllowAll extends RuleUnitBase {
  name = RuleUnitNames.AllowAll
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.locals, ...fanout.builtins, ...fanout.packages]
  }

  protected judge() {
    return true
  }
}

export class AllowAllLayers extends RuleUnitBase {
  name = RuleUnitNames.AllowAllLayers

  protected positive = true

  protected target(fanout: Fanout) {
    // includes self
    return [...fanout.locals]
  }

  protected judge() {
    return true
  }
}

export class AllowAllPackages extends RuleUnitBase {
  name = RuleUnitNames.AllowAllPackages
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.builtins, ...fanout.packages]
  }

  protected judge() {
    return true
  }
}

export class AllowAllNodejs extends RuleUnitBase {
  name = RuleUnitNames.AllowAllNodejs
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.builtins]
  }

  protected judge() {
    return true
  }
}

export class AllowLayers extends RuleUnitBase {
  name = RuleUnitNames.AllowLayers
  layers: DLintLayer[]
  protected positive = true

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
  packages: string[]
  protected positive = true

  constructor(packages: string[]) {
    super()
    this.packages = packages
  }

  protected target(fanout: Fanout) {
    return [...fanout.packages, ...fanout.builtins]
  }

  protected judge(module: PackageModule) {
    return this.packages.includes(module.name)
  }
}

// --- disallowing rule units

export class DisallowAll extends AllowAll {
  name = RuleUnitNames.DisallowAll
  protected positive = false
}

export class DisallowLayers extends AllowLayers {
  name = RuleUnitNames.DisallowLayers
  protected positive = false
}

export class DisallowPackages extends AllowPackages {
  name = RuleUnitNames.DisallowPackages
  protected positive = false
}

export class DisallowAllLayers extends AllowAllLayers {
  name = RuleUnitNames.DisallowAllLayers
  protected positive = false
}

export class DisallowAllPackages extends AllowAllPackages {
  name = RuleUnitNames.DisallowAllPackages
  protected positive = false
}

export class DisallowAllNodejs extends AllowAllNodejs {
  name = RuleUnitNames.DisallowAllNodejs
  protected positive = false
}
