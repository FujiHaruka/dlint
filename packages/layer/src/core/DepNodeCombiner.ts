import {
  LocalModule,
  ModuleType,
  FilePath,
  FileFanout,
  DLintNode,
  Fanin,
} from '@dlint/core'

const FaninResolver = (fanouts: FileFanout[]) => {
  const faninMap: { [path: string]: Set<LocalModule> } = {}
  for (const { fanout, file } of fanouts) {
    for (const localModule of fanout.locals) {
      const { path } = localModule
      if (!faninMap[path.absolutePath]) {
        faninMap[path.absolutePath] = new Set<LocalModule>()
      }
      faninMap[path.absolutePath].add({
        type: ModuleType.LOCAL,
        path: file,
      })
    }
  }
  const resolveFanin = (filePath: FilePath): Fanin => ({
    locals: Array.from(faninMap[filePath.absolutePath] || []),
  })
  return resolveFanin
}

export const DepNodeCombiner = {
  combine(fanouts: FileFanout[]): DLintNode[] {
    const resolveFanin = FaninResolver(fanouts)
    const depNodes = fanouts.map(({ fanout, file }) => ({
      file,
      fanout,
      fanin: resolveFanin(file),
    }))
    return depNodes
  },
}
