import { FilePath } from '@dlint/layer/build/core/module/FilePath'

import {
  reduceDisallowedResults,
  RuleAllowanceStatus,
} from '../../../src/core/RuleAppliedResult'
import { MockNode, MockLayer } from '../../tools/Mocks'
import {
  DisallowAll,
  AllowAll,
  AllowPackages,
  AllowLayers,
  RuleUnitNames,
  DisallowPackages,
  DisallowLayers,
} from '../../../src/core/RuleUnits'

it('works with empty array', () => {
  const node = MockNode.simple()
  expect(reduceDisallowedResults(node, [])).toEqual({
    node,
    statuses: [],
  })
})

it('works disallow -> allow', () => {
  const node = MockNode.multiple()

  const results = [
    new DisallowAll(),
    new AllowPackages(['foo']),
    new AllowLayers([MockLayer.layer1()]),
  ].map((rule) => rule.apply(node))

  const reduced = reduceDisallowedResults(node, results)
  expect(reduced).toEqual({
    statuses: [
      {
        module: {
          path: new FilePath('/project', 'base/module.js'),
          type: 'module:local',
        },
        ruleUnitName: RuleUnitNames.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: {
          path: new FilePath('/project', 'layer2/module.js'),
          type: 'module:local',
        },
        ruleUnitName: RuleUnitNames.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: { name: 'fs', type: 'module:builtin' },
        ruleUnitName: RuleUnitNames.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: { name: 'bar', type: 'module:package' },
        ruleUnitName: RuleUnitNames.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
    ],
    node,
  })
})

it('works allow -> disallow', () => {
  const node = MockNode.multiple()

  const results = [
    new AllowAll(),
    new DisallowPackages(['foo']),
    new DisallowLayers([MockLayer.layer1()]),
  ].map((rule) => rule.apply(node))

  const reduced = reduceDisallowedResults(node, results)
  expect(reduced).toEqual({
    statuses: [
      {
        module: {
          path: new FilePath('/project', 'layer1/module.js'),
          type: 'module:local',
        },
        ruleUnitName: RuleUnitNames.DisallowLayers,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: { name: 'foo', type: 'module:package' },
        ruleUnitName: RuleUnitNames.DisallowPackages,
        status: RuleAllowanceStatus.DISALLOWED,
      },
    ],
    node,
  })
})
