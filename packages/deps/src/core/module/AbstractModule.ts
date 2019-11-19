export interface AbstractModule {
  type: 'builtin' | 'package' | 'local'
  name: string
}

export const ModuleTypes = {
  BUILTIN: 'builtin',
  PACKAGE: 'package',
  LOCAL: 'local',
} as const
