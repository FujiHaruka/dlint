export interface DlintModule {
  type: string
  name: string
}

export const DlintModuleTypes = {
  BUILTIN: 'builtin',
  PACKAGE: 'package',
  LOCAL: 'local',
} as const
