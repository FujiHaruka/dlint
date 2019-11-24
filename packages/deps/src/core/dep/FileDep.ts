import assert from 'assert'
import path from 'path'

import {
  LocalModule,
  PackageModule,
  BuiltinModule,
} from '../module/DLintModule'

export interface FileDepFanin {
  locals: LocalModule[]
}

export interface FileDepFanout {
  locals: LocalModule[]
  packages: PackageModule[]
  builtins: BuiltinModule[]
}

export class FileDep {
  file: string
  fanout: FileDepFanout

  constructor(filtPath: string, fanout: FileDepFanout) {
    assert.ok(path.isAbsolute(filtPath), `Must be absolute path: ${filtPath}`)
    this.file = filtPath
    this.fanout = fanout
  }
}
