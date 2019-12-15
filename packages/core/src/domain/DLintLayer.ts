import { DLintNode } from './DLintNode'
import { LocalModule } from './DLintModule'

export interface DLintLayerMeta {
  rootDir: string
  patterns: string[]
}

export interface DLintLayer {
  name: string
  meta: DLintLayerMeta
  nodes: DLintNode[]
  has(localModule: LocalModule): boolean
}
