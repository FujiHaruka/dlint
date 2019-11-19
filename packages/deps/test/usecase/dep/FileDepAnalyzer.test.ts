import path from 'path'

import {
  FileDepAnalyzer,
  FileDepParser,
} from '../../../src/usecase/dep/FieDepAnalyzer'
import { ModuleClassifier } from '../../../src/usecase/module/ModuleClassifier'

it('works', () => {
  const mockParser: FileDepParser = {
    parse(): string[] {
      return ['./baz', 'xxx', 'fs']
    },
  }
  const classifier = new ModuleClassifier({
    resolver: {
      resolve(id: string): string {
        switch (id) {
          case './baz':
            return '/foo/bar/baz'
          case 'xxx':
            return '/foo/bar/node_modules/xxx'
          case 'fs':
            return 'fs'
          default:
            throw new Error()
        }
      },
    },
  })
  const analyzer = new FileDepAnalyzer({
    parser: mockParser,
    classifier,
  })
  const fileDep = analyzer.fromSource('module.js', '')
  expect(fileDep.fanout.locals).toHaveLength(1)
  expect(fileDep.fanout.packages).toHaveLength(1)
  expect(fileDep.fanout.builtins).toHaveLength(1)
})
