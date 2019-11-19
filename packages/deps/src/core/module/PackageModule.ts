import { DlintModuleTypes, DlintModule } from './DlintModule'

export class PackageModule {
  type = DlintModuleTypes.PACKAGE
  name: string

  constructor(name: string) {
    // TODO: Assertion
    this.name = name
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.PACKAGE
  }
}
