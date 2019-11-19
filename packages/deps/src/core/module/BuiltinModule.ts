import assert from 'assert'
import Module from 'module'

import { AbstractModule, ModuleTypes } from './AbstractModule'

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

  static is(mod: AbstractModule): mod is BuiltinModule {
    return mod.type === ModuleTypes.BUILTIN
  }
}
