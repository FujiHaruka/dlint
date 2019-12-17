import { FilePath, ModuleType } from '@dlint/core'

import { printDLintError } from '../../../src/util/printUtil'

it('works', () => {
  printDLintError({
    node: {
      file: new FilePath('/project', 'module.js'),
      fanin: {
        locals: [],
      },
      fanout: {
        locals: [],
        packages: [],
        builtins: [],
      },
    },
    statuses: [
      {
        ruleUnitName: 'DisallowAll',
        module: {
          type: ModuleType.BUILTIN,
          name: 'fs',
        },
      },
    ],
  })
})
