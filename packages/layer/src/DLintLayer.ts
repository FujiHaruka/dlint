import { parse as acornParse } from 'acorn'
import glob from 'fast-glob'

import { DepNode } from './core/dep/DepNode'
import { Parser, ParserAdapter } from './adapter/ParserAdapter'
import { DepAnalyzer } from './core/dep/DepAnalyzer'
import { DepNodeCombiner } from './core/dep/DepNodeCombiner'
import { ModuleResolver } from './resolver/ModuleResolver'
import { FilePath } from './core/module/FilePath'
import { LocalModule } from './core/module/DLintModule'
import {
  DLintLayer as IDLintLayer,
  DLintLayerMeta,
} from './core/layer/DLintLayer'

export * from './core/dep/DepNode'
export * from './core/module/DLintModule'

export interface GatherDepsOptions {
  rootDir?: string
  parser?: Parser
  ignorePatterns?: string[]
}

const defaultParser: Parser = {
  parse: (code: string) =>
    acornParse(code, {
      sourceType: 'module',
    }),
}

export class DLintLayer implements IDLintLayer {
  name: string
  meta: DLintLayerMeta
  nodes: DepNode[]

  private constructor({
    name,
    meta,
    nodes,
  }: {
    name: string
    meta: DLintLayerMeta
    nodes: DepNode[]
  }) {
    this.name = name
    this.meta = meta
    this.nodes = nodes
  }

  static async gatherDeps(
    name: string,
    patterns: string[],
    options: GatherDepsOptions = {},
  ): Promise<DLintLayer> {
    const {
      parser = defaultParser,
      rootDir = process.cwd(),
      ignorePatterns = [],
    } = options
    const analizer = new DepAnalyzer({
      parser: ParserAdapter.adapt(parser),
      resolver: new ModuleResolver(rootDir),
    })
    const files = await glob(patterns, {
      cwd: rootDir,
      absolute: true,
      ignore: ignorePatterns,
    })
    if (files.length === 0) {
      console.warn(
        `[@dlint/deps][WARNING] Could not find any files matching patterns ${JSON.stringify(
          patterns,
        )}`,
      )
    }
    const filePaths = files.map(
      (absolutePath) => new FilePath(rootDir, absolutePath),
    )
    const fileDeps = await Promise.all(
      filePaths.map((filePath) => analizer.fromFile(filePath)),
    )
    const depNodes = DepNodeCombiner.combine(fileDeps)
    return new this({
      name,
      meta: {
        rootDir,
        patterns,
      },
      nodes: depNodes,
    })
  }

  has(localModule: LocalModule): boolean {
    return this.nodes.some(
      (node) => node.file.absolutePath === localModule.path.absolutePath,
    )
  }
}
