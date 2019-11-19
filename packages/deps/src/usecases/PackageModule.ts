import {
  DlintPackageModule,
  DlintModuleTypes,
  DlintModule,
} from '../entities/DlintModule'

export class PackageModule implements DlintPackageModule {
  type = DlintModuleTypes.PACKAGE
  name: string

  private constructor(name: string) {
    this.name = name
  }

  static create(name: string): PackageModule {
    // TODO: Assertion
    return new PackageModule(name)
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.PACKAGE
  }
}
