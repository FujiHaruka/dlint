import { Parser } from '../adapter/ParserAdapter'

export enum ParserNames {
  ACORN = 'acorn',
  TS = '@typescript-eslint/typescript-estree',
}

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
  resolve(name: ParserNames) {
    switch (name) {
      case ParserNames.ACORN:
        return acornParser
      case ParserNames.TS:
        return tsParser
      default:
        throw new Error(`Unsupported parser: "${name}"`)
    }
  },
}
