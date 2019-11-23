import Module from 'module'
import { join, dirname } from 'path'

import { DLintModuleResolver } from '../../src/core/module/ModuleClassifier'
import {
  AbstractModule,
  ModuleTypes,
} from '../../src/core/module/AbstractModule'

export class MockModuleResolver implements DLintModuleResolver {
  root: string

  constructor({ rootFile }: { rootFile: string }) {
    this.root = dirname(rootFile)
  }

  async resolve(name: string): Promise<AbstractModule> {
    if (Module.builtinModules.includes(name)) {
      return Promise.resolve({
        type: ModuleTypes.BUILTIN,
        name,
      })
    }
    if (name.startsWith('.')) {
      return Promise.resolve({
        type: ModuleTypes.LOCAL,
        name: join(this.root, name),
      })
    } else {
      return Promise.resolve({
        type: ModuleTypes.PACKAGE,
        name: name,
      })
    }
  }
}
