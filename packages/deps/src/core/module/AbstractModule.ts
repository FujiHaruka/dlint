export interface AbstractModule {
  type: 'module:builtin' | 'module:package' | 'module:local'
  name: string
}

export const ModuleTypes = {
  BUILTIN: 'module:builtin',
  PACKAGE: 'module:package',
  LOCAL: 'module:local',
} as const
