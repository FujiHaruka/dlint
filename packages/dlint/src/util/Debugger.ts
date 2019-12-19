import chalk from 'chalk'

const debug = (...msgs: string[]) =>
  console.log(...[chalk.blue('[DEBUG]'), ...msgs])

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export const Debugger = (enabled: boolean) => (enabled ? debug : noop)
