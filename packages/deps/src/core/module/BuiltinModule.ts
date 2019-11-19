import assert from 'assert'
import Module from 'module'

import { ModuleBase, ModuleTypes } from './ModuleBase'

export class BuiltinModule {
  type = ModuleTypes.BUILTIN
  name: string

  constructor(name: string) {
    assert.ok(
      Module.builtinModules.includes(name),
      `"${name}" is not builtin module`,
    )
    this.name = name
  }

  static is(mod: ModuleBase): boolean {
    return mod.type === ModuleTypes.BUILTIN
  }
}
