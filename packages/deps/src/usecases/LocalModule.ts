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

  private constructor(path: string) {
    this.name = path
    this.path = path
  }

  static create(filepath: string): LocalModule {
    assert.ok(
      path.isAbsolute(filepath),
      `LocalModule path must be absolute path: "${filepath}"`,
    )
    return new LocalModule(filepath)
  }

  static is(mod: DlintModule): boolean {
    return mod.type === DlintModuleTypes.LOCAL
  }
}
