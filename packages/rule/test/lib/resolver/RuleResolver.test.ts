import { RuleTarget, DLintRuleExpression } from '@dlint/core'

import { RuleResolver } from '../../../src/resolver/RuleResolver'
import { MockLayer } from '../../tools/Mocks'
import {
  AllowAll,
  AllowAllPackages,
  AllowAllLayers,
  AllowAllNodejs,
  AllowPackages,
  AllowLayers,
  DisallowAll,
  DisallowAllPackages,
  DisallowAllLayers,
  DisallowAllNodejs,
  DisallowPackages,
  DisallowLayers,
} from '../../../src/core/RuleUnits'

it('validate()', () => {
  const layers = new Map([['layer1', MockLayer.layer1()]])
  const resolver = new RuleResolver(MockLayer.layer1(), layers)

  expect(
    resolver.validate({
      allow: RuleTarget.ALL,
    }),
  ).toEqual({
    positive: true,
    target: RuleTarget.ALL,
  })
  expect(
    resolver.validate({
      disallow: RuleTarget.PACKAGES,
      on: ['fs'],
    }),
  ).toEqual({
    args: ['fs'],
    positive: false,
    target: RuleTarget.PACKAGES,
  })
  expect(() => resolver.validate({} as DLintRuleExpression)).toThrow()
  expect(() =>
    resolver.validate({
      allow: RuleTarget.ALL,
      disallow: RuleTarget.ALL,
    } as DLintRuleExpression),
  ).toThrow()
  expect(() =>
    resolver.resolve({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allow: 'no-such-rule' as any,
    }),
  ).toThrow()
})

it('resolve()', () => {
  const layers = new Map([['layer1', MockLayer.layer1()]])
  const resolver = new RuleResolver(MockLayer.layer1(), layers)

  expect(resolver.resolve({ allow: RuleTarget.ALL })).toBeInstanceOf(AllowAll)
  expect(resolver.resolve({ allow: RuleTarget.ALL_PACKAGES })).toBeInstanceOf(
    AllowAllPackages,
  )
  expect(resolver.resolve({ allow: RuleTarget.ALL_LAYERS })).toBeInstanceOf(
    AllowAllLayers,
  )
  expect(resolver.resolve({ allow: RuleTarget.ALL_NODEJS })).toBeInstanceOf(
    AllowAllNodejs,
  )
  expect(
    resolver.resolve({ allow: RuleTarget.PACKAGES, on: ['fs'] }),
  ).toBeInstanceOf(AllowPackages)
  expect(
    resolver.resolve({ allow: RuleTarget.LAYERS, on: ['layer1'] }),
  ).toBeInstanceOf(AllowLayers)
  expect(() =>
    resolver.resolve({ allow: RuleTarget.LAYERS, on: ['layer_not_found'] }),
  ).toThrow()
  expect(resolver.resolve({ disallow: RuleTarget.ALL })).toBeInstanceOf(
    DisallowAll,
  )
  expect(
    resolver.resolve({ disallow: RuleTarget.ALL_PACKAGES }),
  ).toBeInstanceOf(DisallowAllPackages)
  expect(resolver.resolve({ disallow: RuleTarget.ALL_LAYERS })).toBeInstanceOf(
    DisallowAllLayers,
  )
  expect(resolver.resolve({ disallow: RuleTarget.ALL_NODEJS })).toBeInstanceOf(
    DisallowAllNodejs,
  )
  expect(
    resolver.resolve({ disallow: RuleTarget.PACKAGES, on: ['fs'] }),
  ).toBeInstanceOf(DisallowPackages)
  expect(
    resolver.resolve({ disallow: RuleTarget.LAYERS, on: ['layer1'] }),
  ).toBeInstanceOf(DisallowLayers)
})
