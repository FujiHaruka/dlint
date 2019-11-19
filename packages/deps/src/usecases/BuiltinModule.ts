import {
  DlintModule,
  DlintModuleTypes,
  DlintBuiltinModule,
} from '../entities/DlintModule'

export const isBuiltinModule = (mod: DlintModule): boolean =>
  mod.type === DlintModuleTypes.BUILTIN

export class BuiltinModule implements DlintBuiltinModule {
  type = DlintModuleTypes.BUILTIN
  name: string

  private constructor(name: string) {
    this.name = name
  }

  static create(name: string): BuiltinModule {
    // TODO: Assertion
    return new BuiltinModule(name)
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.BUILTIN
  }
}
