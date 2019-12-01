import { DepAnalyzer, DepParser } from '../../../../src/core/dep/DepAnalyzer'
import { MockModuleResolver } from '../../../tools/MockModuleResolver'
import { FilePath } from '../../../../src/core/module/FilePath'

it('works', async () => {
  const mockParser: DepParser = {
    parseImports(): string[] {
      return ['./baz', 'xxx', 'fs']
    },
  }
  const analyzer = new DepAnalyzer({
    parser: mockParser,
    resolver: new MockModuleResolver('/'),
  })
  const fileDep = await analyzer.fromSource(
    new FilePath('/', '/project/module.js'),
    '',
  )
  expect(fileDep.fanout.locals).toHaveLength(1)
  expect(fileDep.fanout.packages).toHaveLength(1)
  expect(fileDep.fanout.builtins).toHaveLength(1)
})
