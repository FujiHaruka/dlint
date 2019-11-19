import {
  DlintLocalModule,
  DlintPackageModule,
  DlintBuiltinModule,
} from './DlintModule'

export interface Fanin {
  locals: DlintLocalModule[]
}

export interface Fanout {
  locals: DlintLocalModule[]
  packages: DlintPackageModule[]
  builtins: DlintBuiltinModule[]
}
