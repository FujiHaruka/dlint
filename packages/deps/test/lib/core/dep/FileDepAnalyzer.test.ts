import {
  FileDepAnalyzer,
  FileDepParser,
} from '../../../../src/core/dep/FieDepAnalyzer'
import { ModuleClassifier } from '../../../../src/core/module/ModuleClassifier'
import { MockModuleResolver } from '../../../tools/MockModuleResolver'

it('works', async () => {
  const mockParser: FileDepParser = {
    parse(): string[] {
      return ['./baz', 'xxx', 'fs']
    },
  }
  const classifier = new ModuleClassifier({
    resolver: new MockModuleResolver({ rootFile: '/project/root.js' }),
  })
  const analyzer = new FileDepAnalyzer({
    parser: mockParser,
    classifier,
  })
  const fileDep = await analyzer.fromSource('/project/module.js', '')
  expect(fileDep.fanout.locals).toHaveLength(1)
  expect(fileDep.fanout.packages).toHaveLength(1)
  expect(fileDep.fanout.builtins).toHaveLength(1)
})
