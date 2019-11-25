import { parse as acornParse } from 'acorn'

import { ParserAdapter } from '../../../src/adapter/ParserAdapter'

it('works', () => {
  const parser = ParserAdapter.adapt({
    parse: (code: string) =>
      acornParse(code, {
        sourceType: 'module',
      }),
  })

  expect(parser.parseImports('')).toEqual([])
  expect(parser.parseImports('import "foo"')).toEqual(['foo'])
  expect(parser.parseImports('require("foo")')).toEqual(['foo'])
  expect(parser.parseImports('export * from "foo"')).toEqual(['foo'])
  expect(parser.parseImports('export { name1, name2 } from "foo"')).toEqual([
    'foo',
  ])
  expect(
    parser.parseImports(
      'export { import1 as name1, import2 as name2 } from "foo"',
    ),
  ).toEqual(['foo'])
  expect(parser.parseImports('export { default } from "foo"')).toEqual(['foo'])
})
