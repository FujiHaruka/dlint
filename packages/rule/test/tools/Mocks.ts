import minimatch from 'minimatch'
import {
  DLintNode,
  ModuleType,
  DLintLayer,
  LocalModule,
  FilePath,
} from '@dlint/core'

export const MockNode = {
  simple(): DLintNode {
    const node: DLintNode = {
      file: new FilePath('/project', 'base'),
      fanin: {
        locals: [],
      },
      fanout: {
        packages: [{ type: ModuleType.PACKAGE, name: 'foo' }],
        builtins: [{ type: ModuleType.BUILTIN, name: 'fs' }],
        locals: [
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/project', 'local'),
          },
        ],
      },
    }
    return node
  },
  multiple(): DLintNode {
    const node: DLintNode = {
      file: new FilePath('/project', 'base/root.js'),
      fanin: {
        locals: [],
      },
      fanout: {
        packages: [
          { type: ModuleType.PACKAGE, name: 'foo' },
          { type: ModuleType.PACKAGE, name: 'bar' },
        ],
        builtins: [{ type: ModuleType.BUILTIN, name: 'fs' }],
        locals: [
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/project', 'base/module.js'),
          },
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/project', 'layer1/module.js'),
          },
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/project', 'layer2/module.js'),
          },
        ],
      },
    }
    return node
  },
  json(): DLintNode {
    const node: DLintNode = {
      file: new FilePath('/project', 'json.js'),
      fanin: {
        locals: [],
      },
      fanout: {
        packages: [],
        builtins: [],
        locals: [
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/project', 'package.json'),
          },
          {
            type: ModuleType.LOCAL,
            path: new FilePath('/project', 'module.js'),
          },
        ],
      },
    }
    return node
  },
}

export const MockLayer = {
  simple(): DLintLayer {
    return {
      name: 'simple',
      meta: {
        rootDir: '/project',
        patterns: [],
      },
      // nodes can be empty
      nodes: [],
      has: () => true,
    }
  },
  layer1(): DLintLayer {
    const pattern = 'layer1/**/*.js'
    return {
      name: 'layer1',
      meta: {
        rootDir: '/project',
        patterns: [pattern],
      },
      // nodes can be empty
      nodes: [],
      has(local: LocalModule) {
        return minimatch(local.path.relativePath, pattern)
      },
    }
  },
}
