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
