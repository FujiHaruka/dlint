import { parse } from '@typescript-eslint/typescript-estree'

import { ParserAdapter } from '../../../src/adapter/ParserAdapter'
import { FileDepAnalyzer } from '../../../src/usecase/dep/FieDepAnalyzer'
import { ModuleClassifier } from '../../../src/usecase/module/ModuleClassifier'
import { MockModuleResolver } from '../../tools/MockResolver'
import { ModuleTypes } from '../../../src/core/module/AbstractModule'

it('should work with typescript-estree', () => {
  const code = `
import fs from 'fs'
import color from 'color'
import { parse } from '@typescript-eslint/typescript-estree'

import foo from './../foo'
import { MockModuleResolver } from '../../tools/MockResolver'

export const FOO = 1
`
  const parser = ParserAdapter.adapt(parse)

  const analyzer = new FileDepAnalyzer({
    parser,
    classifier: new ModuleClassifier({
      resolver: new MockModuleResolver('/project'),
    }),
  })

  const dep = analyzer.fromSource('file.ts', code)
  expect(dep).toEqual({
    file: 'file.ts',
    fanout: {
      locals: [
        {
          type: ModuleTypes.LOCAL,
          name: '/foo',
          path: '/foo',
        },
        {
          type: ModuleTypes.LOCAL,
          name: '/tools/MockResolver',
          path: '/tools/MockResolver',
        },
      ],
      packages: [
        {
          type: ModuleTypes.PACKAGE,
          name: 'color',
        },
        {
          type: ModuleTypes.PACKAGE,
          name: '@typescript-eslint/typescript-estree',
        },
      ],
      builtins: [
        {
          type: ModuleTypes.BUILTIN,
          name: 'fs',
        },
      ],
    },
  })
})
