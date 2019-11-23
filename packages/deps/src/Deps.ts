import { parse as acornParse } from 'acorn'
import glob from 'fast-glob'

import { DepNode } from './core/dep/DepNode'
import { Parser } from './adapter/ParserAdapter'
import { FileDepAnalyzer } from './core/dep/FieDepAnalyzer'
import {
  ModuleClassifier,
  ModuleResolver,
} from './core/module/ModuleClassifier'
import { DepNodeBuilder } from './core/dep/DepNodeBuilder'

export interface GatherDepsOptions {
  cwd?: string
  parser?: Parser
}

const defaultParser: Parser = {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  parse: (code: string) =>
    acornParse(code, {
      sourceType: 'module',
    }),
}

const defaultResolver: ModuleResolver = {
  resolve: require.resolve,
}

export const gatherDeps = async (
  patterns: string[],
  options: GatherDepsOptions = {},
): Promise<DepNode[]> => {
  const { parser = defaultParser, cwd = process.cwd() } = options
  const analizer = new FileDepAnalyzer({
    parser,
    classifier: new ModuleClassifier({
      resolver: defaultResolver,
    }),
  })
  const files = await glob(patterns, {
    cwd,
  })
  const fileDeps = await Promise.all(
    files.map((file) => analizer.fromFile(file)),
  )
  const depNodes = DepNodeBuilder.fromFileDeps(fileDeps)
  return depNodes
}
