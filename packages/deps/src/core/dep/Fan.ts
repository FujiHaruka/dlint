import { AbstractModule } from '../module/AbstractModule'
import { LocalModule } from '../module/LocalModule'
import { PackageModule } from '../module/PackageModule'
import { BuiltinModule } from '../module/BuiltinModule'

export interface Fanin {
  locals: AbstractModule[]
}

export interface Fanout {
  locals: LocalModule[]
  packages: PackageModule[]
  builtins: BuiltinModule[]
}
