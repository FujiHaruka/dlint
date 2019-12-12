import {
  RuleResolver,
  RuleExpression,
} from '../../../src/resolver/RuleResolver'
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
  const resolver = new RuleResolver(layers)

  expect(
    resolver.validate({
      allow: 'all',
    }),
  ).toEqual({
    positive: true,
    target: 'all',
  })
  expect(
    resolver.validate({
      disallow: 'packages',
      on: ['fs'],
    }),
  ).toEqual({
    args: ['fs'],
    positive: false,
    target: 'packages',
  })
  expect(() => resolver.validate({} as RuleExpression)).toThrow()
  expect(() =>
    resolver.validate({
      allow: 'all',
      disallow: 'all',
    } as RuleExpression),
  ).toThrow()
  expect(() =>
    resolver.resolve({
      allow: 'no-such-rule',
    }),
  ).toThrow()
})

it('resolve()', () => {
  const layers = new Map([['layer1', MockLayer.layer1()]])
  const resolver = new RuleResolver(layers)

  expect(resolver.resolve({ allow: 'all' })).toBeInstanceOf(AllowAll)
  expect(resolver.resolve({ allow: 'allPackages' })).toBeInstanceOf(
    AllowAllPackages,
  )
  expect(resolver.resolve({ allow: 'allLayers' })).toBeInstanceOf(
    AllowAllLayers,
  )
  expect(resolver.resolve({ allow: 'allNodejs' })).toBeInstanceOf(
    AllowAllNodejs,
  )
  expect(resolver.resolve({ allow: 'packages', on: ['fs'] })).toBeInstanceOf(
    AllowPackages,
  )
  expect(resolver.resolve({ allow: 'layers', on: ['layer1'] })).toBeInstanceOf(
    AllowLayers,
  )
  expect(() =>
    resolver.resolve({ allow: 'layers', on: ['layer_not_found'] }),
  ).toThrow()
  expect(resolver.resolve({ disallow: 'all' })).toBeInstanceOf(DisallowAll)
  expect(resolver.resolve({ disallow: 'allPackages' })).toBeInstanceOf(
    DisallowAllPackages,
  )
  expect(resolver.resolve({ disallow: 'allLayers' })).toBeInstanceOf(
    DisallowAllLayers,
  )
  expect(resolver.resolve({ disallow: 'allNodejs' })).toBeInstanceOf(
    DisallowAllNodejs,
  )
  expect(resolver.resolve({ disallow: 'packages', on: ['fs'] })).toBeInstanceOf(
    DisallowPackages,
  )
  expect(
    resolver.resolve({ disallow: 'layers', on: ['layer1'] }),
  ).toBeInstanceOf(DisallowLayers)
})
