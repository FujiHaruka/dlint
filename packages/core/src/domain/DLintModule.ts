import { FilePath } from '../std/FilePath'
import { ModuleType } from '../enum/ModuleType'

export interface LocalModule {
  type: ModuleType.LOCAL
  path: FilePath
}

export interface PackageModule {
  type: ModuleType.PACKAGE
  name: string
}

export interface BuiltinModule {
  type: ModuleType.BUILTIN
  name: string
}

export type DLintModule = LocalModule | PackageModule | BuiltinModule

export const DLintModuleUtil = {
  is: {
    LocalModule: (module: DLintModule): module is LocalModule =>
      module.type === ModuleType.LOCAL,
    PackageModule: (module: DLintModule): module is PackageModule =>
      module.type === ModuleType.PACKAGE,
    BuiltinModule: (module: DLintModule): module is BuiltinModule =>
      module.type === ModuleType.BUILTIN,
  },
  toKeyString: (mod: DLintModule): string => {
    switch (mod.type) {
      case ModuleType.BUILTIN:
        return `${mod.type}#${mod.name}`
      case ModuleType.PACKAGE:
        return `${mod.type}#${mod.name}`
      case ModuleType.LOCAL:
        return `${mod.type}#${mod.path.absolutePath}`
      default:
        // never
        throw new Error(`Unknown module type: ${(mod as DLintModule).type}`)
    }
  },
  equals: (moduleA: DLintModule, moduleB: DLintModule) => {
    return (
      DLintModuleUtil.toKeyString(moduleA) ===
      DLintModuleUtil.toKeyString(moduleB)
    )
  },
  format(module: DLintModule) {
    switch (module.type) {
      case ModuleType.BUILTIN:
      case ModuleType.PACKAGE:
        return module.name
      case ModuleType.LOCAL:
        return module.path.relativePath
    }
  },
}
