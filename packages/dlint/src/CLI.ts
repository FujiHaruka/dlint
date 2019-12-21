import commander from 'commander'
import chalk from 'chalk'

import { DLint } from './DLint'
import { formatDLintError, formatSummary } from './util/MessageFormatter'

commander
  .name('dlint')
  .version(require('../package.json').version)
  .option('-c, --config <configPath>', 'Use this rule file')
  .option('--verbose', 'Verbose output')
  .parse(process.argv)

const configPath = (commander.config || '') as string
const verbose = (commander.verbose || false) as boolean

async function main({
  configPath,
  verbose,
}: {
  configPath: string
  verbose: boolean
}) {
  const dlint = await DLint.init(configPath, { verbose })
  const disallowed = dlint.applyRule()
  if (disallowed.length === 0) {
    return
  }
  console.log('')
  for (const result of disallowed) {
    console.log(formatDLintError(result))
  }
  console.log(formatSummary(disallowed))
  console.log('')
  process.exit(1)
}

main({ configPath, verbose }).catch((e) => {
  if (verbose) {
    console.error(e)
  } else {
    console.error(chalk.red('Error:'))
    console.error('  ' + e.message)
  }
  process.exit(1)
})
