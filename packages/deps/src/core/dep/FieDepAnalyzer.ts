import path from 'path'
import { promises as fs } from 'fs'

import { ModuleClassifier } from '../module/ModuleClassifier'
import { LocalModule } from '../module/LocalModule'
import { PackageModule } from '../module/PackageModule'
import { BuiltinModule } from '../module/BuiltinModule'

import { FileDep } from './FileDep'

export interface FileDepParser {
  parse: (code: string) => string[]
}

export class FileDepAnalyzer {
  parser: FileDepParser
  classifier: ModuleClassifier

  constructor({
    parser,
    classifier,
  }: {
    parser: FileDepParser
    classifier: ModuleClassifier
  }) {
    this.parser = parser
    this.classifier = classifier
  }

  async fromFile(file: string): Promise<FileDep> {
    const absPath = path.resolve(file)
    const source = await fs.readFile(absPath, 'utf-8')
    return this.fromSource(file, source)
  }

  async fromSource(file: string, source: string): Promise<FileDep> {
    const names = this.parser.parse(source)
    const modules = await Promise.all(
      names.map((name) => this.classifier.classify(name)),
    )
    return new FileDep(file, {
      locals: modules.filter(LocalModule.is),
      packages: modules.filter(PackageModule.is),
      builtins: modules.filter(BuiltinModule.is),
    })
  }
}
