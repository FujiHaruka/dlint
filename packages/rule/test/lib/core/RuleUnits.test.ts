import {
  DepNode,
  ModuleTypes,
  DLintModule,
} from '@dlint/layer/build/DLintLayer'
import { FilePath } from '@dlint/layer/build/core/module/FilePath'

import { AllowAll, RuleUnitNames } from '../../../src/core/RuleUnits'
import { RuleAllowanceStatus } from '../../../src/core/RuleAppliedResult'

it('AllowAll', () => {
  const allowAll = new AllowAll()

  const pkg = { type: ModuleTypes.PACKAGE, name: 'foo' } as const
  const builtin = { type: ModuleTypes.BUILTIN, name: 'fs' } as const
  const local = {
    type: ModuleTypes.LOCAL,
    path: new FilePath('/project', 'local'),
  } as const
  const node: DepNode = {
    file: new FilePath('/project', 'base'),
    fanin: {
      locals: [],
    },
    fanout: {
      packages: [pkg],
      builtins: [builtin],
      locals: [local],
    },
  }
  const result = allowAll.apply(node)
  expect(result.node).toEqual(node)
  expect(result.ruleUnitName).toEqual(RuleUnitNames.AllowAll)
  const allow = (module: DLintModule) => ({
    ruleUnitName: RuleUnitNames.AllowAll,
    status: RuleAllowanceStatus.ALLOWED,
    module,
  })
  expect(result.statuses()).toContainEqual(allow(local))
  expect(result.statuses()).toContainEqual(allow(pkg))
  expect(result.statuses()).toContainEqual(allow(builtin))
})
