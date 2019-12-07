import { promises as fs } from 'fs'

import { DLintModuleResolver } from '../module/DLintModuleResolver'
import { is } from '../module/DLintModule'
import { FilePath } from '../module/FilePath'

import { FileFanout } from './DepNode'

export interface DepParser {
  parseImports: (code: string) => string[]
}

export class DepAnalyzer {
  parser: DepParser
  resolver: DLintModuleResolver

  constructor({
    parser,
    resolver,
  }: {
    parser: DepParser
    resolver: DLintModuleResolver
  }) {
    this.parser = parser
    this.resolver = resolver
  }

  async fromFile(path: FilePath): Promise<FileFanout> {
    const source = await fs.readFile(path.absolutePath, 'utf-8')
    return this.fromSource(path, source)
  }

  async fromSource(path: FilePath, source: string): Promise<FileFanout> {
    const names = this.parser.parseImports(source)
    const modules = await Promise.all(
      names.map((name) => this.resolver.resolve(path.absolutePath, name)),
    )
    return {
      file: path,
      fanout: {
        locals: modules.filter(is.LocalModule),
        packages: modules.filter(is.PackageModule),
        builtins: modules.filter(is.BuiltinModule),
      },
    }
  }
}
