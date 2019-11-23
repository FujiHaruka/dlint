import {
  LocalModule,
  PackageModule,
  BuiltinModule,
} from '../module/DLintModule'

export interface Fanin {
  locals: LocalModule[]
}

export interface Fanout {
  locals: LocalModule[]
  packages: PackageModule[]
  builtins: BuiltinModule[]
}
