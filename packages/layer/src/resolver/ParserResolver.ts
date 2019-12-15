import { ParserPackage } from '@dlint/core'

import { Parser } from '../adapter/ParserAdapter'

const acornParser: Parser = {
  parse: (code: string) =>
    require('acorn').parse(code, {
      sourceType: 'module',
    }),
}

const tsParser: Parser = {
  parse: (code: string) =>
    require('@typescript-eslint/typescript-estree').parse(code),
}

export const ParserResolver = {
  resolve(name: ParserPackage) {
    switch (name) {
      case ParserPackage.ACORN:
        return acornParser
      case ParserPackage.TS:
        return tsParser
      default:
        throw new Error(`Unsupported parser: "${name}"`)
    }
  },
}
