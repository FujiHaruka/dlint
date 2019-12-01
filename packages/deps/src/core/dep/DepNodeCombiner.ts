import { LocalModule, ModuleTypes } from '../module/DLintModule'
import { FilePath } from '../module/FilePath'

import { FileFanout, DepNode, Fanin } from './DepNode'

const FaninResolver = (fanouts: FileFanout[]) => {
  const faninMap: { [path: string]: Set<LocalModule> } = {}
  for (const { fanout, file } of fanouts) {
    for (const localModule of fanout.locals) {
      const { path } = localModule
      if (!faninMap[path.absolutePath]) {
        faninMap[path.absolutePath] = new Set<LocalModule>()
      }
      faninMap[path.absolutePath].add({
        type: ModuleTypes.LOCAL,
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
  combine(fanouts: FileFanout[]): DepNode[] {
    const resolveFanin = FaninResolver(fanouts)
    const depNodes = fanouts.map(({ fanout, file }) => ({
      file,
      fanout,
      fanin: resolveFanin(file),
    }))
    return depNodes
  },
}
