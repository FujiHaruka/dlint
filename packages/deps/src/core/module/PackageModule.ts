import assert from 'assert'
import path from 'path'

import { ModuleTypes, ModuleBase } from './ModuleBase'

export class PackageModule {
  type = ModuleTypes.PACKAGE
  name: string

  constructor(name: string) {
    assert.ok(
      !path.isAbsolute(name),
      `PackageModule must not be absolute path: ${name}`,
    )
    this.name = name
  }

  static is(mod: ModuleBase): boolean {
    return mod.type === ModuleTypes.PACKAGE
  }
}
