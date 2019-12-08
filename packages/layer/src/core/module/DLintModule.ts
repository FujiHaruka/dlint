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

export const equals = (moduleA: DLintModule, moduleB: DLintModule) => {
  if (moduleA.type !== moduleB.type) {
    return false
  }
  switch (moduleA.type) {
    case ModuleTypes.BUILTIN:
      return moduleA.name === (moduleB as BuiltinModule).name
    case ModuleTypes.PACKAGE:
      return moduleA.name === (moduleB as PackageModule).name
    case ModuleTypes.LOCAL:
      return (
        moduleA.path.absolutePath === (moduleB as LocalModule).path.absolutePath
      )
    default:
      // never
      throw new Error(`Unknown module type: ${(moduleA as DLintModule).type}`)
  }
}
