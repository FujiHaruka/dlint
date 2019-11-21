import assert from 'assert'
import path from 'path'

import { Fanout } from './Fan'

export class FileDep {
  file: string
  fanout: Fanout

  constructor(filtPath: string, fanout: Fanout) {
    assert.ok(path.isAbsolute(filtPath), `Must be absolute path: ${filtPath}`)
    this.file = filtPath
    this.fanout = fanout
  }
}
