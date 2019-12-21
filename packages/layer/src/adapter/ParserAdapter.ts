/* eslint-disable @typescript-eslint/no-explicit-any */
import { DepParser } from '../core/DepAnalyzer'

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

const ESMImportTypes = new Set([
  'ImportDeclaration',
  'ExportAllDeclaration',
  'ExportNamedDeclaration',
])

const CallExpressionType = 'CallExpression'
const LiteralType = 'Literal'

const primitives = new Set(['string', 'number', 'undefined', 'boolean'])
const isPrimitive = (value: unknown): boolean => {
  return primitives.has(typeof value) || value === null
}

// require を呼び出している CallExpression を再帰的に探索
const REQUIRE_FUNCTION = 'require'
const findRequireCall = (node: any): string[] => {
  if (Array.isArray(node)) {
    return node.flatMap((item) => findRequireCall(item))
  }
  if (node.type === CallExpressionType) {
    if (
      node.arguments?.[0]?.type === LiteralType &&
      typeof node.arguments?.[0]?.value === 'string' &&
      node.callee?.name === REQUIRE_FUNCTION
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
      return findRequireCall(child)
    })
  }
}

const collectModuleNames = {
  inESM(ast: any): string[] {
    return ast.body
      .filter((statement: any) => ESMImportTypes.has(statement.type))
      .map(
        (statement: any): string => statement.source && statement.source.value,
      )
      .filter(Boolean)
  },
  inCJS(ast: any): string[] {
    return findRequireCall(ast)
  },
}

const uniq = (arr: string[]): string[] => Array.from(new Set(arr))

export const ParserAdapter = {
  adapt(parser: Parser): DepParser {
    return {
      parseImports(code: string): string[] {
        // TODO: Improve error handling
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
