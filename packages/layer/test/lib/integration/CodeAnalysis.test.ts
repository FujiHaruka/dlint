import { parse as tsParse } from '@typescript-eslint/typescript-estree'
import { parse as acornParse } from 'acorn'
import { ModuleType, FilePath } from '@dlint/core'

import { ParserAdapter, Parser } from '../../../src/adapter/ParserAdapter'
import { DepAnalyzer } from '../../../src/core/DepAnalyzer'
import { MockModuleResolver } from '../../tools/MockModuleResolver'

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
      parse: (code: string) =>
        acornParse(code, {
          sourceType: 'module',
        }),
    },
    {
      parse: (code: string) => tsParse(code),
    },
  ]

  const analyzers = parsers.map(
    (parser) =>
      new DepAnalyzer({
        parser: ParserAdapter.adapt(parser),
        resolver: new MockModuleResolver('/'),
      }),
  )

  for (const analyzer of analyzers) {
    const dep = await analyzer.fromSource(
      new FilePath('/', '/project/file.ts'),
      code,
    )
    expect(dep).toEqual({
      file: new FilePath('/', '/project/file.ts'),
      fanout: {
        locals: [
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/', '/foo'),
          },
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/', '/tools/MockResolver'),
          },
        ],
        packages: [
          {
            type: ModuleType.PACKAGE,
            name: 'color',
          },
          {
            type: ModuleType.PACKAGE,
            name: '@typescript-eslint/typescript-estree',
          },
        ],
        builtins: [
          {
            type: ModuleType.BUILTIN,
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
  const analyzer = new DepAnalyzer({
    parser: ParserAdapter.adapt({
      parse: (code: string) =>
        acornParse(code, {
          sourceType: 'module',
        }),
    }),
    resolver: new MockModuleResolver('/'),
  })
  const dep = await analyzer.fromSource(
    new FilePath('/', '/project/root.js'),
    code,
  )
  expect(dep.fanout).toEqual({
    locals: [
      {
        type: ModuleType.LOCAL,
        path: new FilePath('/', '/project/tools/MockResolver'),
      },
    ],
    packages: [{ type: 'module:package', name: 'core-js/stable' }],
    builtins: [{ type: 'module:builtin', name: 'fs' }],
  })
})
