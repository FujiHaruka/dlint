import { parse as acornParse } from 'acorn'
import glob from 'fast-glob'

import { DepNode } from './core/dep/DepNode'
import { Parser, ParserAdapter } from './adapter/ParserAdapter'
import { FileDepAnalyzer } from './core/dep/FieDepAnalyzer'
import { DepNodeBuilder } from './core/dep/DepNodeBuilder'
import { ModuleResolver } from './resolver/ModuleResolver'

export interface GatherDepsOptions {
  rootDir?: string
  parser?: Parser
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
  const { parser = defaultParser, rootDir = process.cwd() } = options
  const analizer = new FileDepAnalyzer({
    parser: ParserAdapter.adapt(parser),
    resolver: new ModuleResolver(),
  })
  // TODO: ファイルが一つも無ければ警告出す
  const files = await glob(patterns, {
    cwd: rootDir,
    absolute: true,
  })
  const fileDeps = await Promise.all(
    files.map((file) => analizer.fromFile(file)),
  )
  const depNodes = DepNodeBuilder.fromFileDeps(fileDeps, {
    relativeFrom: rootDir,
  })
  return {
    meta: {
      rootDir,
      patterns,
    },
    nodes: depNodes,
  }
}
