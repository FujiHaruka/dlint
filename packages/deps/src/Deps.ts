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
  const analizer = new FileDepAnalyzer({
    parser: ParserAdapter.adapt(parser),
    resolver: new ModuleResolver(),
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
