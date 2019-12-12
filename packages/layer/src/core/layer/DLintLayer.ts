import { DepNode } from '../dep/DepNode'
import { LocalModule } from '../module/DLintModule'

export interface DLintLayerMeta {
  rootDir: string
  patterns: string[]
}

export interface DLintLayer {
  name: string
  meta: DLintLayerMeta
  nodes: DepNode[]
  has(localModule: LocalModule): boolean
}
