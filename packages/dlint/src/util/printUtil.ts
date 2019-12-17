import { EOL } from 'os'

import chalk from 'chalk'
import { DLintError, DLintModule, ModuleType } from '@dlint/core'

class Message {
  value = ''

  append(...messages: string[]) {
    this.value += messages.join(' ') + EOL
  }
}

const moduleDesc = (mod: DLintModule) => {
  switch (mod.type) {
    case ModuleType.BUILTIN:
    case ModuleType.PACKAGE:
      return mod.name
    case ModuleType.LOCAL:
      return mod.path.relativePath
  }
}

export const printDLintError = (result: DLintError) => {
  const message = new Message()
  message.append(chalk.white.underline(result.node.file.absolutePath))
  for (const { ruleUnitName, module } of result.statuses) {
    message.append(' ', chalk.red('error'), ruleUnitName, moduleDesc(module))
  }
  console.log(message.value)
}
