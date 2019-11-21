import Module from 'module'
import { resolve } from 'path'

import { ModuleResolver } from '../../src/core/module/ModuleClassifier'

export class MockModuleResolver implements ModuleResolver {
  projectRoot: string

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
  }

  resolve(name: string): string {
    if (Module.builtinModules.includes(name)) {
      return name
    }
    if (name.startsWith('./')) {
      return resolve(this.projectRoot, name)
    } else {
      return resolve(this.projectRoot, 'node_modules', name)
    }
  }
}
