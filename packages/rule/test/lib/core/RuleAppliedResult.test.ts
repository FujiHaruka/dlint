import { FilePath, RuleUnitName } from '@dlint/core'

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
  DisallowPackages,
  DisallowLayers,
} from '../../../src/core/RuleUnits'

it('works with empty array', () => {
  const layer = MockLayer.simple()
  const node = MockNode.simple()
  expect(reduceDisallowedResults(layer, node, [])).toEqual({
    node,
    statuses: [],
    layer,
  })
})

it('works disallow -> allow', () => {
  const layer = MockLayer.simple()
  const node = MockNode.multiple()

  const results = [
    new DisallowAll(),
    new AllowPackages(['foo']),
    new AllowLayers([MockLayer.layer1()]),
  ].map((rule) => rule.apply(node))

  const reduced = reduceDisallowedResults(layer, node, results)
  expect(reduced).toEqual({
    statuses: [
      {
        module: {
          path: new FilePath('/project', 'base/module.js'),
          type: 'module:local',
        },
        ruleUnitName: RuleUnitName.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: {
          path: new FilePath('/project', 'layer2/module.js'),
          type: 'module:local',
        },
        ruleUnitName: RuleUnitName.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: { name: 'fs', type: 'module:builtin' },
        ruleUnitName: RuleUnitName.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: { name: 'bar', type: 'module:package' },
        ruleUnitName: RuleUnitName.DisallowAll,
        status: RuleAllowanceStatus.DISALLOWED,
      },
    ],
    node,
    layer,
  })
})

it('works allow -> disallow', () => {
  const layer = MockLayer.simple()
  const node = MockNode.multiple()

  const results = [
    new AllowAll(),
    new DisallowPackages(['foo']),
    new DisallowLayers([MockLayer.layer1()]),
  ].map((rule) => rule.apply(node))

  const reduced = reduceDisallowedResults(layer, node, results)
  expect(reduced).toEqual({
    statuses: [
      {
        module: {
          path: new FilePath('/project', 'layer1/module.js'),
          type: 'module:local',
        },
        ruleUnitName: RuleUnitName.DisallowLayers,
        status: RuleAllowanceStatus.DISALLOWED,
      },
      {
        module: { name: 'foo', type: 'module:package' },
        ruleUnitName: RuleUnitName.DisallowPackages,
        status: RuleAllowanceStatus.DISALLOWED,
      },
    ],
    node,
    layer,
  })
})
