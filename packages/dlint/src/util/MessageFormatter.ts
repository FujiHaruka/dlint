import { EOL } from 'os'

import chalk from 'chalk'
import { DLintError, DLintModuleUtil, RuleUnitNameUtil } from '@dlint/core'

const Styled = (message: string, style: (message: string) => string) =>
  style(message)
const Block = (inlines: string[]) => inlines.join(' ')
const join = (blocks: string[]) => blocks.join(EOL) + EOL

export const formatDLintError = (result: DLintError) => {
  return join([
    Styled(result.node.file.absolutePath, chalk.white.underline),
    ...result.statuses.map(({ ruleUnitName, module }) =>
      Block([
        ' ',
        Styled('error', chalk.red),
        Styled('Rule', chalk.gray),
        Styled(`"${RuleUnitNameUtil.format(ruleUnitName)}"`, chalk.white),
        Styled(`disallows to depend on`, chalk.gray),
        Styled(`"${DLintModuleUtil.format(module)}"`, chalk.white),
      ]),
    ),
  ])
}

export const formatSummary = (results: DLintError[]) => {
  const errorCount = results.reduce(
    (count, result) => count + result.statuses.length,
    0,
  )
  return Styled(
    `✖ ${errorCount} error${errorCount === 1 ? '' : 's'}`,
    chalk.redBright,
  )
}
