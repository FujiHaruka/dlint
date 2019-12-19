import commander from 'commander'

import { DLint } from './DLint'
import { formatDLintError, formatSummary } from './util/MessageFormatter'

commander
  .name('dlint')
  .version(require('../package.json').version, '-v')
  .option('-c, --config <configPath>', 'Use this rule file')
  .parse(process.argv)

const configPath = (commander.config || '') as string

async function main({ configPath }: { configPath: string }) {
  const dlint = await DLint.init(configPath)
  const disallowed = dlint.applyRule()
  if (disallowed.length === 0) {
    return
  }
  console.log('')
  for (const result of disallowed) {
    console.log(formatDLintError(result))
  }
  console.log(formatSummary(disallowed))
}

main({ configPath }).catch((e) => {
  console.error(e)
  process.exit(1)
})
