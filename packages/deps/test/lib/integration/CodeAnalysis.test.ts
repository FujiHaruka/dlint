import { parse as tsParse } from '@typescript-eslint/typescript-estree'
import { parse as acornParse } from 'acorn'

import { ParserAdapter, Parser } from '../../../src/adapter/ParserAdapter'
import { FileDepAnalyzer } from '../../../src/core/dep/FieDepAnalyzer'
import { ModuleClassifier } from '../../../src/core/module/ModuleClassifier'
import { MockModuleResolver } from '../../tools/MockResolver'
import { ModuleTypes } from '../../../src/core/module/AbstractModule'

it('works with ESM with some parsers', () => {
  const code = `
import fs from 'fs'
import color from 'color'
import { parse } from '@typescript-eslint/typescript-estree'

import foo from './../foo'
import { MockModuleResolver } from '../../tools/MockResolver'

export const FOO = 1
`
  const parsers: Parser[] = [
    {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      parse: (code: string) =>
        acornParse(code, {
          sourceType: 'module',
        }),
    },
    {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      parse: (code: string) => tsParse(code),
    },
  ]

  const analyzers = parsers.map(
    (parser) =>
      new FileDepAnalyzer({
        parser: ParserAdapter.adapt(parser),
        classifier: new ModuleClassifier({
          resolver: new MockModuleResolver('/project'),
        }),
      }),
  )

  for (const analyzer of analyzers) {
    const dep = analyzer.fromSource('/project/file.ts', code)
    expect(dep).toEqual({
      file: '/project/file.ts',
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
  }
})

it('works with CJS', () => {
  const code = `
const fs = require('fs')
require('core-js/stable')
const { MockModuleResolver } = require('../../tools/MockResolver')

module.exports = 1
`
  const analyzer = new FileDepAnalyzer({
    parser: ParserAdapter.adapt({
      parse: (code: string) =>
        acornParse(code, {
          sourceType: 'module',
        }),
    }),
    classifier: new ModuleClassifier({
      resolver: new MockModuleResolver('/project'),
    }),
  })
  const dep = analyzer.fromSource('/project/file.ts', code)
  console.log(dep)
  // TODO: EMS と CJS は全く違うので ParserAdapter の実装が必要
})
