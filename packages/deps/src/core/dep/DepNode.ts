import { Fanin, Fanout } from './Fan'
import { FileDep } from './FileDep'

export class DepNode {
  file: string
  fanin: Fanin
  fanout: Fanout

  private constructor(file: string, fanin: Fanin, fanout: Fanout) {
    this.file = file
    this.fanin = fanin
    this.fanout = fanout
  }

  static fromFileDep(dep: FileDep, fanin: Fanin): DepNode {
    return new DepNode(dep.file, fanin, dep.fanout)
  }
}
