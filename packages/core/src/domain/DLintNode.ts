import { FilePath } from '../std/FilePath'

import { LocalModule, PackageModule, BuiltinModule } from './DLintModule'

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

export interface DLintNode {
  file: FilePath
  fanin: Fanin
  fanout: Fanout
}
