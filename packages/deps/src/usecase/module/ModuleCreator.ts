import path from 'path'
import Module from 'module'

import { LocalModule } from '../../core/module/LocalModule'
import { BuiltinModule } from '../../core/module/BuiltinModule'
import { PackageModule } from '../../core/module/PackageModule'

const isPath = (str: string): boolean =>
  path.isAbsolute(str) || str.startsWith('./')

const isBuiltin = (name: string): boolean => {
  // TODO: Browser の場合は不要
  return Module.builtinModules.includes(name)
}

export const ModuleCreator = {
  create(name: string): LocalModule | PackageModule | BuiltinModule {
    const isLocal = isPath(name)
    if (isLocal) {
      const filepath = path.resolve(name)
      return new LocalModule(filepath)
    }
    if (isBuiltin(name)) {
      return new BuiltinModule(name)
    } else {
      return new PackageModule(name)
    }
  },
}
