import { EOL } from 'os'

import chalk from 'chalk'
import Ajv from 'ajv'

const IgnoreKeys = ['schemaPath', 'keyword']

const formatAjvError = (error: Ajv.ErrorObject) =>
  Object.entries(error)
    .filter(([key]) => !IgnoreKeys.includes(key))
    .map(([key, value]) => {
      if (key === 'message') {
        return `${chalk.gray(key)}: ${chalk.redBright(value)}`
      }
      if (typeof value === 'object' && value !== null) {
        return `${chalk.gray(key)}: ${JSON.stringify(value)}`
      } else {
        return `${chalk.gray(key)}: ${value}`
      }
    })
    .join(EOL)

export const formatAjvErrors = (
  configPath: string,
  errors: Ajv.ErrorObject[],
) =>
  `Invalid config: ${configPath}` +
  EOL +
  errors.map(formatAjvError).join(EOL + EOL) +
  EOL
