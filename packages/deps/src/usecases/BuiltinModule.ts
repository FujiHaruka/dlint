import {
  DlintModule,
  DlintModuleTypes,
  DlintBuiltinModule,
} from '../entities/DlintModule'

export class BuiltinModule implements DlintBuiltinModule {
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
