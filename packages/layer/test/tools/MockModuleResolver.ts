import Module from 'module'
import { join, dirname } from 'path'

import { DLintModuleResolver } from '../../src/core/module/DLintModuleResolver'
import { DLintModule, ModuleTypes } from '../../src/core/module/DLintModule'
import { FilePath } from '../../src/core/module/FilePath'

export class MockModuleResolver implements DLintModuleResolver {
  rootDir: string

  constructor(rootDir: string) {
    this.rootDir = rootDir
  }

  async resolve(from: string, name: string): Promise<DLintModule> {
    if (Module.builtinModules.includes(name)) {
      return Promise.resolve({
        type: ModuleTypes.BUILTIN,
        name,
      })
    }
    if (name.startsWith('.')) {
      return Promise.resolve({
        type: ModuleTypes.LOCAL,
        path: new FilePath(this.rootDir, join(dirname(from), name)),
      })
    } else {
      return Promise.resolve({
        type: ModuleTypes.PACKAGE,
        name: name,
      })
    }
  }
}
