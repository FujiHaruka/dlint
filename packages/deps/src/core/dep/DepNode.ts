import { FileDepFanin, FileDep } from './FileDep'

interface DepNodeFanin {
  locals: string[]
}

interface DepNodeFanout {
  locals: string[]
  packages: string[]
  builtins: string[]
}

export class DepNode {
  file: string
  fanin: DepNodeFanin
  fanout: DepNodeFanout

  private constructor({
    file,
    fanin,
    fanout,
  }: {
    file: string
    fanin: DepNodeFanin
    fanout: DepNodeFanout
  }) {
    this.file = file
    this.fanin = fanin
    this.fanout = fanout
  }

  static fromFileDep(dep: FileDep, fanin: FileDepFanin): DepNode {
    const { file, fanout } = dep
    return new DepNode({
      file,
      fanin: {
        locals: fanin.locals.map(({ path }) => path),
      },
      fanout: {
        locals: fanout.locals.map(({ path }) => path),
        packages: fanout.packages.map(({ name }) => name),
        builtins: fanout.builtins.map(({ name }) => name),
      },
    })
  }
}
