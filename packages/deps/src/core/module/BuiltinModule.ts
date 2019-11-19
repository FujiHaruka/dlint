import { DlintModule, DlintModuleTypes } from './DlintModule'

export class BuiltinModule {
  type = DlintModuleTypes.BUILTIN
  name: string

  constructor(name: string) {
    // TODO: Assertion
    this.name = name
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.BUILTIN
  }
}
