import Module from 'module'
import { join, dirname } from 'path'

import { DLintModuleResolver } from '../../src/core/module/DLintModuleResolver'
import { DLintModule, ModuleTypes } from '../../src/core/module/DLintModule'

export class MockModuleResolver implements DLintModuleResolver {
  async resolve(from: string, name: string): Promise<DLintModule> {
    const root = dirname(from)
    if (Module.builtinModules.includes(name)) {
      return Promise.resolve({
        type: ModuleTypes.BUILTIN,
        name,
      })
    }
    if (name.startsWith('.')) {
      return Promise.resolve({
        type: ModuleTypes.LOCAL,
        path: join(root, name),
      })
    } else {
      return Promise.resolve({
        type: ModuleTypes.PACKAGE,
        name: name,
      })
    }
  }
}
