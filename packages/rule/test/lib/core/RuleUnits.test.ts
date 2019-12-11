import { DLintModule } from '@dlint/layer/build/DLintLayer'

import {
  AllowAll,
  RuleUnitNames,
  AllowLayers,
  DisallowLayers,
} from '../../../src/core/RuleUnits'
import { RuleAllowanceStatus } from '../../../src/core/RuleAppliedResult'
import { MockNode, MockLayer } from '../../tools/Mocks'

it('AllowAll', () => {
  const allowAll = new AllowAll()

  const node = MockNode.simple()
  const result = allowAll.apply(node)
  expect(result.node).toEqual(node)
  expect(result.ruleUnitName).toEqual(RuleUnitNames.AllowAll)
  const allow = (module: DLintModule) => ({
    ruleUnitName: RuleUnitNames.AllowAll,
    status: RuleAllowanceStatus.ALLOWED,
    module,
  })
  expect(result.statuses()).toContainEqual(allow(node.fanout.locals[0]))
  expect(result.statuses()).toContainEqual(allow(node.fanout.packages[0]))
  expect(result.statuses()).toContainEqual(allow(node.fanout.builtins[0]))
})

it('units', () => {
  expect(new AllowLayers([]).apply(MockNode.simple()).statuses()).toEqual([])
  expect(
    new AllowLayers([MockLayer.simple()]).apply(MockNode.simple()).statuses(),
  ).toEqual([
    {
      ruleUnitName: RuleUnitNames.AllowLayers,
      status: RuleAllowanceStatus.ALLOWED,
      module: MockNode.simple().fanout.locals[0],
    },
  ])
  expect(
    new AllowLayers([MockLayer.layer1()]).apply(MockNode.multiple()).statuses(),
  ).toEqual([
    {
      ruleUnitName: RuleUnitNames.AllowLayers,
      status: RuleAllowanceStatus.ALLOWED,
      module: MockNode.multiple().fanout.locals[1],
    },
  ])
  expect(
    new DisallowLayers([MockLayer.layer1()])
      .apply(MockNode.multiple())
      .statuses(),
  ).toEqual([
    {
      ruleUnitName: RuleUnitNames.DisallowLayers,
      status: RuleAllowanceStatus.DISALLOWED,
      module: MockNode.multiple().fanout.locals[1],
    },
  ])
})
