import { DepNode } from '../dep/DepNode'
import { LocalModule } from '../module/DLintModule'

export interface DLintLayerMeta {
  rootDir: string
  patterns: string[]
}

export interface DLintLayer {
  meta: DLintLayerMeta
  nodes: DepNode[]
  isMember(localModule: LocalModule): boolean
}
