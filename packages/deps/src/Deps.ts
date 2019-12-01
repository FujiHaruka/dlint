import { parse as acornParse } from 'acorn'
import glob from 'fast-glob'

import { DepNode } from './core/dep/DepNode'
import { Parser, ParserAdapter } from './adapter/ParserAdapter'
import { DepAnalyzer } from './core/dep/DepAnalyzer'
import { DepNodeCombiner } from './core/dep/DepNodeCombiner'
import { ModuleResolver } from './resolver/ModuleResolver'
import { FilePath } from './core/module/FilePath'

export interface GatherDepsOptions {
  rootDir?: string
  parser?: Parser
  ignore?: string[]
}

export interface GatheredDepNodes {
  meta: {
    rootDir: string
    patterns: string[]
  }
  nodes: DepNode[]
}

const defaultParser: Parser = {
  parse: (code: string) =>
    acornParse(code, {
      sourceType: 'module',
    }),
}

export const gatherDeps = async (
  patterns: string[],
  options: GatherDepsOptions = {},
): Promise<GatheredDepNodes> => {
  const {
    parser = defaultParser,
    rootDir = process.cwd(),
    ignore = [],
  } = options
  const analizer = new DepAnalyzer({
    parser: ParserAdapter.adapt(parser),
    resolver: new ModuleResolver(rootDir),
  })
  const files = await glob(patterns, {
    cwd: rootDir,
    absolute: true,
    ignore,
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
  return {
    meta: {
      rootDir,
      patterns,
    },
    nodes: depNodes,
  }
}
