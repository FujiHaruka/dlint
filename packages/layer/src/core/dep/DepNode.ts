import {
  LocalModule,
  PackageModule,
  BuiltinModule,
} from '../module/DLintModule'
import { FilePath } from '../module/FilePath'

export interface Fanin {
  locals: LocalModule[]
}

export interface Fanout {
  locals: LocalModule[]
  packages: PackageModule[]
  builtins: BuiltinModule[]
}

export interface FileFanout {
  file: FilePath
  fanout: Fanout
}

export interface DepNode {
  file: FilePath
  fanin: Fanin
  fanout: Fanout
}
