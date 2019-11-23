import { Fanin, Fanout } from './Fan'
import { FileDep } from './FileDep'

export interface SlimDepNode {
  file: string
  fanin: {
    locals: string[]
  }
  fanout: {
    locals: string[]
    packages: string[]
    builtins: string[]
  }
}

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

  slim(): SlimDepNode {
    const { file, fanout, fanin } = this
    return {
      file,
      fanin: {
        locals: fanin.locals.map(({ path }) => path),
      },
      fanout: {
        locals: fanout.locals.map(({ path }) => path),
        packages: fanout.packages.map(({ name }) => name),
        builtins: fanout.builtins.map(({ name }) => name),
      },
    }
  }
}
