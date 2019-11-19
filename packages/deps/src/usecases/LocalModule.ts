import path from 'path'
import { strict as assert } from 'assert'

import {
  DlintModule,
  DlintModuleTypes,
  DlintLocalModule,
} from '../entities/DlintModule'

export class LocalModule implements DlintLocalModule {
  type = DlintModuleTypes.LOCAL
  name: string
  path: string

  constructor(filepath: string) {
    assert.ok(
      path.isAbsolute(filepath),
      `LocalModule path must be absolute path: "${filepath}"`,
    )
    this.name = filepath
    this.path = filepath
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.LOCAL
  }
}
