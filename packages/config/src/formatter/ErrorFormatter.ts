import { EOL } from 'os'

import chalk from 'chalk'

import { ValidationError } from '../core/DLintConfigSchema'

const formatValidationError = (error: ValidationError) => {
  return `${error.dataPath} ${error.message}`
}

export const formatValidationErrors = (
  configPath: string,
  errors: ValidationError[],
) =>
  `Invalid config: ${configPath}` +
  EOL +
  errors
    .map(formatValidationError)
    .map((message) => `${chalk.redBright('✖')} ${message}`)
    .join(EOL) +
  EOL
