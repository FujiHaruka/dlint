import { DLintModule } from './DLintModule'

export interface DLintModuleResolver {
  resolve: (from: string, name: string) => Promise<DLintModule>
}
