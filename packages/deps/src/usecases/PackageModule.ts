import {
  DlintPackageModule,
  DlintModuleTypes,
  DlintModule,
} from '../entities/DlintModule'

export class PackageModule implements DlintPackageModule {
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
