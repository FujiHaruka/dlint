import { FileDepParser } from '../core/dep/FieDepAnalyzer'

// For AST spec, see ESTree https://github.com/estree/estree/blob/master/es2015.md#importdeclaration

interface Statement {
  type: string
  source: {
    value: string
  }
}

export interface AcceptableAST {
  body: Statement[]
}

export interface Parser {
  parse(code: string): any
}

const ImportDeclarationType = 'ImportDeclaration'

export const ParserAdapter = {
  adapt(parser: Parser): FileDepParser {
    return {
      parse(code: string): string[] {
        const ast = parser.parse(code) as AcceptableAST

        return ast.body
          .filter((statement: any) => statement.type === ImportDeclarationType)
          .map((statement: any): string => statement.source.value)
      },
    }
  },
}
