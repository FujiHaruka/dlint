import { DLintModule } from '@dlint/core'

export interface DLintModuleResolver {
  resolve: (from: string, name: string) => Promise<DLintModule>
}
