import path from 'path'
import { promises as fs } from 'fs'

import { DLintModuleResolver } from '../module/DLintModuleResolver'
import { is } from '../module/DLintModule'

import { FileDep } from './FileDep'

export interface FileDepParser {
  parseImports: (code: string) => string[]
}

export class FileDepAnalyzer {
  parser: FileDepParser
  resolver: DLintModuleResolver

  constructor({
    parser,
    resolver,
  }: {
    parser: FileDepParser
    resolver: DLintModuleResolver
  }) {
    this.parser = parser
    this.resolver = resolver
  }

  async fromFile(file: string): Promise<FileDep> {
    const absPath = path.resolve(file)
    const source = await fs.readFile(absPath, 'utf-8')
    return this.fromSource(file, source)
  }

  async fromSource(file: string, source: string): Promise<FileDep> {
    const names = this.parser.parseImports(source)
    const modules = await Promise.all(
      names.map((name) => this.resolver.resolve(file, name)),
    )
    return new FileDep(file, {
      locals: modules.filter(is.LocalModule),
      packages: modules.filter(is.PackageModule),
      builtins: modules.filter(is.BuiltinModule),
    })
  }
}
