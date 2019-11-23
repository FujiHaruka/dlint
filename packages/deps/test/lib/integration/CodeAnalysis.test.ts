import { parse as tsParse } from '@typescript-eslint/typescript-estree'
import { parse as acornParse } from 'acorn'

import { ParserAdapter, Parser } from '../../../src/adapter/ParserAdapter'
import { FileDepAnalyzer } from '../../../src/core/dep/FieDepAnalyzer'
import { MockModuleResolver } from '../../tools/MockModuleResolver'
import { ModuleTypes } from '../../../src/core/module/DLintModule'

it('works with ESM with some parsers', async () => {
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
        resolver: new MockModuleResolver(),
      }),
  )

  for (const analyzer of analyzers) {
    const dep = await analyzer.fromSource('/project/file.ts', code)
    expect(dep).toEqual({
      file: '/project/file.ts',
      fanout: {
        locals: [
          {
            type: ModuleTypes.LOCAL,
            path: '/foo',
          },
          {
            type: ModuleTypes.LOCAL,
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

it('works with CJS', async () => {
  const code = `
const fs = require('fs')
require('core-js/stable')
const { MockModuleResolver } = require('./tools/MockResolver')
const name = 'foo'
require(name) // should be skipped

module.exports = 1
`
  const analyzer = new FileDepAnalyzer({
    parser: ParserAdapter.adapt({
      parse: (code: string) =>
        acornParse(code, {
          sourceType: 'module',
        }),
    }),
    resolver: new MockModuleResolver(),
  })
  const dep = await analyzer.fromSource('/project/root.js', code)
  expect(dep.fanout).toEqual({
    locals: [
      {
        type: 'module:local',
        path: '/project/tools/MockResolver',
      },
    ],
    packages: [{ type: 'module:package', name: 'core-js/stable' }],
    builtins: [{ type: 'module:builtin', name: 'fs' }],
  })
})
