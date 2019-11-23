import { LocalModule, ModuleTypes } from '../module/DLintModule'

import { FileDep } from './FileDep'
import { DepNode } from './DepNode'
import { Fanin } from './Fan'

const FaninResolver = (fileDeps: FileDep[]): ((filePath: string) => Fanin) => {
  const faninMap: { [path: string]: Set<LocalModule> } = {}
  for (const dep of fileDeps) {
    for (const localModule of dep.fanout.locals) {
      const { path } = localModule
      if (!faninMap[path]) {
        faninMap[path] = new Set<LocalModule>()
      }
      faninMap[path].add({
        type: ModuleTypes.LOCAL,
        path: dep.file,
      })
    }
  }
  const resolveFanin = (filePath: string): Fanin => ({
    locals: Array.from(faninMap[filePath] || []),
  })
  return resolveFanin
}

export const DepNodeBuilder = {
  fromFileDeps(fileDeps: FileDep[]): DepNode[] {
    const resolveFanin = FaninResolver(fileDeps)
    const depNodes = fileDeps.map((dep) =>
      DepNode.fromFileDep(dep, resolveFanin(dep.file)),
    )
    return depNodes
  },
}
