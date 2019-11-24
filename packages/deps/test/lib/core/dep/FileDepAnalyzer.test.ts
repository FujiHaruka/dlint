import {
  FileDepAnalyzer,
  FileDepParser,
} from '../../../../src/core/dep/FieDepAnalyzer'
import { MockModuleResolver } from '../../../tools/MockModuleResolver'

it('works', async () => {
  const mockParser: FileDepParser = {
    parseImports(): string[] {
      return ['./baz', 'xxx', 'fs']
    },
  }
  const analyzer = new FileDepAnalyzer({
    parser: mockParser,
    resolver: new MockModuleResolver(),
  })
  const fileDep = await analyzer.fromSource('/project/module.js', '')
  expect(fileDep.fanout.locals).toHaveLength(1)
  expect(fileDep.fanout.packages).toHaveLength(1)
  expect(fileDep.fanout.builtins).toHaveLength(1)
})
