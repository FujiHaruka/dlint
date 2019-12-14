/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DLintLayer,
  ModuleTypes,
  LocalModule,
  BuiltinModule,
  PackageModule,
} from '@dlint/layer'
import { FilePath } from '@dlint/layer/build/core/module/FilePath'
import minimatch from 'minimatch'

import { RuleExpression } from '../../../src/resolver/RuleResolver'
import { DLintRule } from '../../../src/DLintRule'

const ROOT_DIR = '/project'
const FANIN = {
  locals: [],
}

const MapFrom = <V>(obj: { [key: string]: V }) =>
  new Map<string, V>(Object.entries(obj))
const Package = (name: string): PackageModule => ({
  type: ModuleTypes.PACKAGE,
  name,
})
const Builtin = (name: string): BuiltinModule => ({
  type: ModuleTypes.BUILTIN,
  name,
})
const Local = (path: string): LocalModule => ({
  type: ModuleTypes.LOCAL,
  path: new FilePath(ROOT_DIR, path),
})
const File = (path: string) => new FilePath(ROOT_DIR, path)

it('works', () => {
  const expressionsMap = MapFrom<RuleExpression[]>({
    controller: [
      {
        disallow: 'all',
      },
      {
        allow: 'layers',
        on: ['core', 'util'],
      },
      {
        allow: 'allNodejs',
      },
    ],
    core: [
      {
        disallow: 'all',
      },
    ],
    main: [
      {
        disallow: 'all',
      },
      {
        allow: 'allLayers',
      },
    ],
    util: [
      {
        disallow: 'all',
      },
      {
        allow: 'packages',
        on: ['os', 'path', 'lodash'],
      },
    ],
  })
  const layers = MapFrom<DLintLayer>({
    controller: {
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
    core: {
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
    main: {
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
    util: {
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
  })

  const rule = new DLintRule(expressionsMap, layers)

  const apply = (layer: DLintLayer) =>
    rule
      .apply(layer)
      .flatMap(({ statuses }) => statuses)
      .map(({ module }) => module)

  {
    const layer = layers.get('controller')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(2)
    expect(disallowed).toContainEqual(Local('other/main.js'))
    expect(disallowed).toContainEqual(Package('will-be-disallowed'))
  }
  {
    const layer = layers.get('core')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(1)
    expect(disallowed).toContainEqual(Package('will-be-disallowed'))
  }
  {
    const layer = layers.get('main')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(2)
    expect(disallowed).toContainEqual(Builtin('path'))
    expect(disallowed).toContainEqual(Package('will-be-disallowed'))
  }
  {
    const layer = layers.get('util')!
    const disallowed = apply(layer)
    expect(disallowed).toHaveLength(1)
    expect(disallowed).toContainEqual(Local('will/disallowed.js'))
  }
})
