import { parse as acornParse } from 'acorn'
import { ParserAdapter } from '../../../src/adapter/ParserAdapter'

it('works', () => {
  const parser = ParserAdapter.adapt({
    parse: (code: string) =>
      acornParse(code, {
        sourceType: 'module',
      }),
  })

  expect(parser.parse('')).toEqual([])
  expect(parser.parse('import "foo"')).toEqual(['foo'])
  expect(parser.parse('require("foo")')).toEqual(['foo'])
})
