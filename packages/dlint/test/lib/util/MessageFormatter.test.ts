import { FilePath, ModuleType, RuleUnitName } from '@dlint/core'

import { formatDLintError } from '../../../src/util/MessageFormatter'

it('works', () => {
  console.log(
    formatDLintError({
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
    }),
  )
})
