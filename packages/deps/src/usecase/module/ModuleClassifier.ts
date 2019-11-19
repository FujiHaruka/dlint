import path from 'path'

import { LocalModule } from '../../core/module/LocalModule'
import { BuiltinModule } from '../../core/module/BuiltinModule'
import { PackageModule } from '../../core/module/PackageModule'

const isInNodeModules = (filepath: string): boolean =>
  filepath.includes('/node_modules/')

export interface ModuleResolver {
  resolve: (name: string) => string
}

export class ModuleClassifier {
  resolver: ModuleResolver

  constructor({ resolver }: { resolver: ModuleResolver }) {
    this.resolver = resolver
  }

  classify(name: string): LocalModule | PackageModule | BuiltinModule {
    const modulePath = this.resolver.resolve(name)
    const isBuiltin = !path.isAbsolute(modulePath)
    if (isBuiltin) {
      return new BuiltinModule(name)
    }
    if (isInNodeModules(modulePath)) {
      return new PackageModule(name)
    } else {
      return new LocalModule(modulePath)
    }
  }
}