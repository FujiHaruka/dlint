import { extname } from 'path'

import {
  Fanout,
  LocalModule,
  PackageModule,
  DLintLayer,
  RuleUnitName,
} from '@dlint/core'

import { RuleUnitBase } from './RuleUnitBase'

// --- allowing rule units

export class AllowAll extends RuleUnitBase {
  name = RuleUnitName.AllowAll
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.locals, ...fanout.builtins, ...fanout.packages]
  }

  protected judge() {
    return true
  }
}

export class AllowAllLayers extends RuleUnitBase {
  name = RuleUnitName.AllowAllLayers

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
  name = RuleUnitName.AllowAllPackages
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.builtins, ...fanout.packages]
  }

  protected judge() {
    return true
  }
}

export class AllowAllNodejs extends RuleUnitBase {
  name = RuleUnitName.AllowAllNodejs
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.builtins]
  }

  protected judge() {
    return true
  }
}

export class AllowAllJson extends RuleUnitBase {
  name = RuleUnitName.AllowAllJson
  protected positive = true

  protected target(fanout: Fanout) {
    return [...fanout.locals]
  }

  protected judge(module: LocalModule) {
    return extname(module.path.relativePath) === '.json'
  }
}

export class AllowLayers extends RuleUnitBase {
  name = RuleUnitName.AllowLayers
  layers: DLintLayer[]
  protected positive = true

  constructor(layers: DLintLayer[]) {
    super()
    this.layers = layers
  }

  protected target(fanout: Fanout) {
    return [...fanout.locals]
  }

  protected judge(module: LocalModule) {
    return this.layers.some((layer) => layer.has(module))
  }
}

export class AllowPackages extends RuleUnitBase {
  name = RuleUnitName.AllowPackages
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
  name = RuleUnitName.DisallowAll
  protected positive = false
}

export class DisallowLayers extends AllowLayers {
  name = RuleUnitName.DisallowLayers
  protected positive = false
}

export class DisallowPackages extends AllowPackages {
  name = RuleUnitName.DisallowPackages
  protected positive = false
}

export class DisallowAllLayers extends AllowAllLayers {
  name = RuleUnitName.DisallowAllLayers
  protected positive = false
}

export class DisallowAllPackages extends AllowAllPackages {
  name = RuleUnitName.DisallowAllPackages
  protected positive = false
}

export class DisallowAllNodejs extends AllowAllNodejs {
  name = RuleUnitName.DisallowAllNodejs
  protected positive = false
}

export class DisallowAllJson extends AllowAllJson {
  name = RuleUnitName.DisallowAllJson
  protected positive = false
}
