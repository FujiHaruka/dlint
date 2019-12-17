import commander from 'commander'

import { DLint } from './DLint'
import { printDisallowed } from './util/printUtil'

commander
  .version(require('../package.json').version, '-v')
  .option('-c, --config <configPath>', 'Use this rule file')
  .parse(process.argv)

const configPath = (commander.rule || '') as string

async function main({ configPath }: { configPath: string }) {
  const dlint = await DLint.init(configPath)
  const disallowed = dlint.applyRule()
  console.log(disallowed)
  if (disallowed.length === 0) {
    return
  }
  for (const result of disallowed) {
    printDisallowed(result)
  }
}

main({ configPath }).catch((e) => {
  console.error(e)
  process.exit(1)
})
