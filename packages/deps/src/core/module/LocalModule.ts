import path from 'path'
import { strict as assert } from 'assert'

import { ModuleBase, ModuleTypes } from './ModuleBase'

export class LocalModule {
  type = ModuleTypes.LOCAL
  name: string
  path: string

  constructor(filepath: string) {
    assert.ok(
      path.isAbsolute(filepath),
      `LocalModule path must be absolute path: "${filepath}"`,
    )
    this.name = filepath
    this.path = filepath
  }

  static is(mod: ModuleBase): boolean {
    return mod.type === ModuleTypes.LOCAL
  }
}
