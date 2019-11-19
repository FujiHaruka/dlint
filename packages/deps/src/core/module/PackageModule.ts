import assert from 'assert'
import path from 'path'

import { DlintModuleTypes, DlintModule } from './DlintModule'

export class PackageModule {
  type = DlintModuleTypes.PACKAGE
  name: string

  constructor(name: string) {
    assert.ok(
      !path.isAbsolute(name),
      `PackageModule must not be absolute path: ${name}`,
    )
    this.name = name
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.PACKAGE
  }
}
