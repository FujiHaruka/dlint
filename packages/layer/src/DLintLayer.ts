import glob from 'fast-glob'
import {
  DLintNode,
  FilePath,
  DLintLayer as IDLintLayer,
  DLintLayerMeta,
  ParserPackage,
  LocalModule,
} from '@dlint/core'

import { ParserAdapter } from './adapter/ParserAdapter'
import { DepAnalyzer } from './core/DepAnalyzer'
import { DepNodeCombiner } from './core/DepNodeCombiner'
import { ModuleResolver } from './resolver/ModuleResolver'
import { ParserResolver } from './resolver/ParserResolver'

export interface GatherDepsOptions {
  rootDir?: string
  parser?: ParserPackage
  ignorePatterns?: string[]
}

export class DLintLayer implements IDLintLayer {
  name: string
  meta: DLintLayerMeta
  nodes: DLintNode[]

  private constructor({
    name,
    meta,
    nodes,
  }: {
    name: string
    meta: DLintLayerMeta
    nodes: DLintNode[]
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
      parser: parserName = ParserPackage.ACORN,
      rootDir = process.cwd(),
      ignorePatterns = [],
    } = options
    const parser = ParserResolver.resolve(parserName)
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
    const nodes = DepNodeCombiner.combine(fileDeps)
    return new this({
      name,
      meta: {
        rootDir,
        patterns,
      },
      nodes,
    })
  }

  has(localModule: LocalModule): boolean {
    return this.nodes.some(
      (node) => node.file.absolutePath === localModule.path.absolutePath,
    )
  }
}
