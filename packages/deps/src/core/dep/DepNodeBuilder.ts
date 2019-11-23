import { relative } from 'path'

import { LocalModule, ModuleTypes } from '../module/DLintModule'

import { FileDep } from './FileDep'
import { DepNode, SlimDepNode } from './DepNode'
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

const toRelative = (from: string, node: DepNode): DepNode => {
  const { file, fanin, fanout } = node
  node.file = relative(from, file)
  node.fanin = {
    locals: fanin.locals.map(({ path }) => ({
      type: ModuleTypes.LOCAL,
      path: relative(from, path),
    })),
  }
  node.fanout = {
    ...node.fanout,
    locals: fanout.locals.map(({ path }) => ({
      type: ModuleTypes.LOCAL,
      path: relative(from, path),
    })),
  }
  return node
}

export const DepNodeBuilder = {
  fromFileDeps(
    fileDeps: FileDep[],
    options: { relativeFrom?: string } = {},
  ): SlimDepNode[] {
    const { relativeFrom } = options
    const resolveFanin = FaninResolver(fileDeps)
    const depNodes = fileDeps
      .map((dep) => DepNode.fromFileDep(dep, resolveFanin(dep.file)))
      .map((node) => (relativeFrom ? toRelative(relativeFrom, node) : node))
      .map((node) => node.slim())
    return depNodes
  },
}
