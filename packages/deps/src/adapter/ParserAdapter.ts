import { FileDepParser } from '../usecase/dep/FieDepAnalyzer'

export const ParserAdapter = {
  adapt(parse: (code: string) => any): FileDepParser {
    return {
      parse(code: string): string[] {
        const ast = parse(code)
        return ast.body
          .filter(({ type }: { type: string }) => type === 'ImportDeclaration')
          .map((statement: any): string => statement.source.value)
      },
    }
  },
}
