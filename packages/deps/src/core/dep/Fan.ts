import { LocalModule } from '../module/LocalModule'
import { PackageModule } from '../module/PackageModule'
import { BuiltinModule } from '../module/BuiltinModule'

export interface Fanin {
  locals: LocalModule[]
}

export interface Fanout {
  locals: LocalModule[]
  packages: PackageModule[]
  builtins: BuiltinModule[]
}
