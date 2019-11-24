/* eslint-disable @typescript-eslint/no-explicit-any */
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
const CallExpressionType = 'CallExpression'
const LiteralType = 'Literal'

const primitives = new Set(['string', 'number', 'undefined', 'boolean'])
const isPrimitive = (value: unknown): boolean => {
  return primitives.has(typeof value) || value === null
}

// require を呼び出している CallExpression を再帰的に探索
const findCallExpressionRecursively = (node: any): string[] => {
  if (!node) {
    return []
  }
  if (Array.isArray(node)) {
    return node.flatMap((item) => findCallExpressionRecursively(item))
  }
  if (node.type === CallExpressionType) {
    if (
      node.arguments &&
      node.arguments[0] &&
      node.arguments[0].type === LiteralType &&
      typeof node.arguments[0].value === 'string'
    ) {
      return [node.arguments[0].value]
    } else {
      // require(variable) のようなのはダメ
      return []
    }
  } else {
    return Object.values(node).flatMap((child: any): string[] => {
      if (isPrimitive(child)) {
        return []
      }
      return findCallExpressionRecursively(child)
    })
  }
}

const collectModuleNames = {
  inESM(ast: any): string[] {
    return ast.body
      .filter((statement: any) => statement.type === ImportDeclarationType)
      .map((statement: any): string => statement.source.value)
  },
  inCJS(ast: any): string[] {
    return findCallExpressionRecursively(ast)
  },
}

const uniq = (arr: string[]): string[] => Array.from(new Set(arr))

export const ParserAdapter = {
  adapt(parser: Parser): FileDepParser {
    return {
      parse(code: string): string[] {
        const ast = parser.parse(code) as AcceptableAST
        const moduleNames = uniq([
          ...collectModuleNames.inESM(ast),
          ...collectModuleNames.inCJS(ast),
        ])
        // TODO: Improve error handling
        if (!Array.isArray(moduleNames)) {
          throw new Error(
            `Invalid parser: moduleNames = ${JSON.stringify(moduleNames)}`,
          )
        }
        return moduleNames
      },
    }
  },
}
