import Module from 'module'
import { join, dirname } from 'path'

import { DLintModule, ModuleType, FilePath } from '@dlint/core'

import { DLintModuleResolver } from '../../src/core/DLintModuleResolver'

export class MockModuleResolver implements DLintModuleResolver {
  rootDir: string

  constructor(rootDir: string) {
    this.rootDir = rootDir
  }

  async resolve(from: string, name: string): Promise<DLintModule> {
    if (Module.builtinModules.includes(name)) {
      return Promise.resolve({
        type: ModuleType.BUILTIN,
        name,
      })
    }
    if (name.startsWith('.')) {
      return Promise.resolve({
        type: ModuleType.LOCAL,
        path: new FilePath(this.rootDir, join(dirname(from), name)),
      })
    } else {
      return Promise.resolve({
        type: ModuleType.PACKAGE,
        name: name,
      })
    }
  }
}
