import path from 'path'
import { promises as fs } from 'fs'

import { FileDep } from '../../core/dep/FileDep'
import { ModuleClassifier } from '../module/ModuleClassifier'
import { LocalModule } from '../../core/module/LocalModule'
import { PackageModule } from '../../core/module/PackageModule'
import { BuiltinModule } from '../../core/module/BuiltinModule'

export interface FileDepParser {
  parse: (source: string) => string[]
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

  fromSource(file: string, source: string): FileDep {
    const names = this.parser.parse(source)
    const modules = names.map((name) => this.classifier.classify(name))
    return new FileDep(file, {
      locals: modules.filter(LocalModule.is),
      packages: modules.filter(PackageModule.is),
      builtins: modules.filter(BuiltinModule.is),
    })
  }
}
