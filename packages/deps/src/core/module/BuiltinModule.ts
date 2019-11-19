import assert from 'assert'
import Module from 'module'

import { DlintModule, DlintModuleTypes } from './DlintModule'

export class BuiltinModule {
  type = DlintModuleTypes.BUILTIN
  name: string

  constructor(name: string) {
    assert.ok(
      Module.builtinModules.includes(name),
      `"${name}" is not builtin module`,
    )
    this.name = name
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.BUILTIN
  }
}
