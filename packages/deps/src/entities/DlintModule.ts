export interface DlintModule {
  type: string
  name: string
}

export interface DlintBuiltinModule extends DlintModule {
  type: 'builtin'
}

export interface DlintPackageModule extends DlintModule {
  type: 'package'
}

export interface DlintLocalModule extends DlintModule {
  type: 'local'
  path: string
}

export const DlintModuleTypes = {
  BUILTIN: 'builtin',
  PACKAGE: 'package',
  LOCAL: 'local',
} as const
