import chalk from 'chalk'

const debug = (...msgs: string[]) =>
  console.log(...[chalk.blue('[DEBUG]'), ...msgs])

export const Debugger = (enabled: boolean) => (enabled ? debug : () => {})
