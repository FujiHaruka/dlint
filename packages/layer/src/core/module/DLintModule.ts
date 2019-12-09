import { FilePath } from './FilePath'

export enum ModuleTypes {
  BUILTIN = 'module:builtin',
  PACKAGE = 'module:package',
  LOCAL = 'module:local',
}

export interface LocalModule {
  type: ModuleTypes.LOCAL
  path: FilePath
}

export interface PackageModule {
  type: ModuleTypes.PACKAGE
  name: string
}

export interface BuiltinModule {
  type: ModuleTypes.BUILTIN
  name: string
}

export type DLintModule = LocalModule | PackageModule | BuiltinModule

export const is = {
  LocalModule: (module: DLintModule): module is LocalModule =>
    module.type === ModuleTypes.LOCAL,
  PackageModule: (module: DLintModule): module is PackageModule =>
    module.type === ModuleTypes.PACKAGE,
  BuiltinModule: (module: DLintModule): module is BuiltinModule =>
    module.type === ModuleTypes.BUILTIN,
}

export const toKeyString = (mod: DLintModule): string => {
  switch (mod.type) {
    case ModuleTypes.BUILTIN:
      return `${mod.type}#${mod.name}`
    case ModuleTypes.PACKAGE:
      return `${mod.type}#${mod.name}`
    case ModuleTypes.LOCAL:
      return `${mod.type}#${mod.path.absolutePath}`
    default:
      // never
      throw new Error(`Unknown module type: ${(mod as DLintModule).type}`)
  }
}

export const equals = (moduleA: DLintModule, moduleB: DLintModule) => {
  return toKeyString(moduleA) === toKeyString(moduleB)
}