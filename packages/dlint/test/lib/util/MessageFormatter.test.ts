import { FilePath, ModuleType, RuleUnitName, DLintError } from '@dlint/core'

import {
  formatDLintError,
  formatSummary,
} from '../../../src/util/MessageFormatter'

it('works', () => {
  const error: DLintError = {
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
        ruleUnitName: RuleUnitName.DisallowAll,
        module: {
          type: ModuleType.BUILTIN,
          name: 'fs',
        },
      },
      {
        ruleUnitName: RuleUnitName.DisallowAll,
        module: {
          type: ModuleType.PACKAGE,
          name: 'some-awesome-package',
        },
      },
      {
        ruleUnitName: RuleUnitName.DisallowAll,
        module: {
          type: ModuleType.LOCAL,
          path: new FilePath('/project', 'dependency.js'),
        },
      },
    ],
  }
  // console.log(formatDLintError(error))
  // console.log(formatSummary([error]))
  expect(formatDLintError(error)).toBeTruthy()
  expect(formatSummary([error])).toBeTruthy()
})
