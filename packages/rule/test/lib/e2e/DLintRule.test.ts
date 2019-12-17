/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DLintLayer,
  ModuleType,
  LocalModule,
  BuiltinModule,
  PackageModule,
  FilePath,
  RuleTarget,
  DLintRuleExpression,
} from '@dlint/core'
import minimatch from 'minimatch'

import { DLintRule, LayerRuleBinding } from '../../../src/DLintRule'

const ROOT_DIR = '/project'
const FANIN = {
  locals: [],
}

const MapFrom = <V>(obj: { [key: string]: V }) =>
  new Map<string, V>(Object.entries(obj))
const Package = (name: string): PackageModule => ({
  type: ModuleType.PACKAGE,
  name,
})
const Builtin = (name: string): BuiltinModule => ({
  type: ModuleType.BUILTIN,
  name,
})
const Local = (path: string): LocalModule => ({
  type: ModuleType.LOCAL,
  path: new FilePath(ROOT_DIR, path),
})
const File = (path: string) => new FilePath(ROOT_DIR, path)

it('works', () => {
  const expressionsMap = MapFrom<DLintRuleExpression[]>({
    controller: [
      {
        disallow: RuleTarget.ALL,
      },
      {
        allow: RuleTarget.LAYERS,
        on: ['core', 'util'],
      },
      {
        allow: RuleTarget.ALL_NODEJS,
      },
    ],
    core: [
      {
        disallow: RuleTarget.ALL,
      },
    ],
    main: [
      {
        disallow: RuleTarget.ALL,
      },
      {
        allow: RuleTarget.ALL_LAYERS,
      },
    ],
    util: [
      {
        disallow: RuleTarget.ALL,
      },
      {
        allow: RuleTarget.PACKAGES,
        on: ['os', 'path', 'lodash'],
      },
    ],
  })
  const layers: DLintLayer[] = [
    {
      name: 'controller',
      meta: {
        rootDir: ROOT_DIR,
        patterns: ['controller/**/*.js'],
      },
      // nodes can be empty
      nodes: [
        {
          file: File('controller/main.js'),
          fanin: FANIN,
          fanout: {
            packages: [Package('will-be-disallowed')],
            builtins: [Builtin('fs')],
            locals: [
              Local('core/main.js'),
              Local('util/main.js'),
              Local('other/main.js'),
            ],
          },
        },
      ],
      has(local: LocalModule) {
        return minimatch(local.path.relativePath, 'controller/**/*.js')
      },
    },
    {
      name: 'core',
      meta: {
        rootDir: ROOT_DIR,
        patterns: ['core/**/*.js'],
      },
      nodes: [
        {
          file: File('core/main.js'),
          fanin: FANIN,
          fanout: {
            packages: [Package('will-be-disallowed')],
            builtins: [],
            locals: [],
          },
        },
      ],
      has(local: LocalModule) {
        return minimatch(local.path.relativePath, 'core/**/*.js')
      },
    },
    {
      name: 'main',
      meta: {
        rootDir: ROOT_DIR,
        patterns: ['main.js'],
      },
      nodes: [
        {
          file: File('main.js'),
          fanin: FANIN,
          fanout: {
            packages: [Package('will-be-disallowed')],
            builtins: [Builtin('path')],
            locals: [
              Local('controller/main.js'),
              Local('util/main.js'),
              Local('core/main.js'),
            ],
          },
        },
      ],
      has(local: LocalModule) {
        return local.path.relativePath === 'main.js'
      },
    },
    {
      name: 'util',
      meta: {
        rootDir: ROOT_DIR,
        patterns: ['util/**/*.js'],
      },
      nodes: [
        {
          file: File('util/main.js'),
          fanin: FANIN,
          fanout: {
            packages: [Package('lodash')],
            builtins: [Builtin('path'), Builtin('os')],
            locals: [Local('will/disallowed.js')],
          },
        },
      ],
      has(local: LocalModule) {
        return minimatch(local.path.relativePath, 'util/**/*.js')
      },
    },
  ]

  const relations: LayerRuleBinding[] = layers.map((layer) => ({
    layer,
    expressions: expressionsMap.get(layer.name) || [],
  }))
  const rule = new DLintRule(relations)

  const apply = (layer: DLintLayer) =>
    rule
      .apply(layer)
      .flatMap(({ statuses }) => statuses)
      .map(({ module }) => module)

  {
    const layer = layers.find(({ name }) => name === 'controller')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(2)
    expect(disallowed).toContainEqual(Local('other/main.js'))
    expect(disallowed).toContainEqual(Package('will-be-disallowed'))
  }
  {
    const layer = layers.find(({ name }) => name === 'core')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(1)
    expect(disallowed).toContainEqual(Package('will-be-disallowed'))
  }
  {
    const layer = layers.find(({ name }) => name === 'main')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(2)
    expect(disallowed).toContainEqual(Builtin('path'))
    expect(disallowed).toContainEqual(Package('will-be-disallowed'))
  }
  {
    const layer = layers.find(({ name }) => name === 'util')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(1)
    expect(disallowed).toContainEqual(Local('will/disallowed.js'))
  }
})
