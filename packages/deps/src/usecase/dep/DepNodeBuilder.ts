import { FileDep } from '../../core/dep/FileDep'
import { DepNode } from '../../core/dep/DepNode'
import { Fanin } from '../../core/dep/Fan'
import { LocalModule } from '../../core/module/LocalModule'

const FaninResolver = (fileDeps: FileDep[]): ((filePath: string) => Fanin) => {
  const faninMap: { [path: string]: Set<LocalModule> } = {}
  for (const dep of fileDeps) {
    for (const localModule of dep.fanout.locals) {
      const { path } = localModule
      if (!faninMap[path]) {
        faninMap[path] = new Set<LocalModule>()
      }
      faninMap[path].add(new LocalModule(path))
    }
  }
  const resolveFanin = (filePath: string): Fanin => ({
    locals: Array.from(faninMap[filePath]),
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
