import {
  DlintLocalModule,
  DlintPackageModule,
  DlintBuiltinModule,
} from './module/ModuleBase'

export interface Fanin {
  locals: DlintLocalModule[]
}

export interface Fanout {
  locals: DlintLocalModule[]
  packages: DlintPackageModule[]
  builtins: DlintBuiltinModule[]
}
