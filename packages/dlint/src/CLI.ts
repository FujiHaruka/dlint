import commander from 'commander'

import { DLint } from './DLint'
import { formatDLintError } from './util/MessageFormatter'

commander
  .version(require('../package.json').version, '-v')
  .option('-c, --config <configPath>', 'Use this rule file')
  .parse(process.argv)

const configPath = (commander.rule || '') as string

async function main({ configPath }: { configPath: string }) {
  const dlint = await DLint.init(configPath)
  const disallowed = dlint.applyRule()
  if (disallowed.length === 0) {
    return
  }
  for (const result of disallowed) {
    console.log(formatDLintError(result))
  }
}

main({ configPath }).catch((e) => {
  console.error(e)
  process.exit(1)
})
