import minimatch from 'minimatch'
import { DepNode, ModuleTypes, DLintLayer, LocalModule } from '@dlint/layer'
import { FilePath } from '@dlint/layer/build/core/module/FilePath'

export const MockNode = {
  simple(): DepNode {
    const node: DepNode = {
      file: new FilePath('/project', 'base'),
      fanin: {
        locals: [],
      },
      fanout: {
        packages: [{ type: ModuleTypes.PACKAGE, name: 'foo' }],
        builtins: [{ type: ModuleTypes.BUILTIN, name: 'fs' }],
        locals: [
          {
            type: ModuleTypes.LOCAL,
            path: new FilePath('/project', 'local'),
          },
        ],
      },
    }
    return node
  },
  multiple(): DepNode {
    const node: DepNode = {
      file: new FilePath('/project', 'base/root.js'),
      fanin: {
        locals: [],
      },
      fanout: {
        packages: [
          { type: ModuleTypes.PACKAGE, name: 'foo' },
          { type: ModuleTypes.PACKAGE, name: 'bar' },
        ],
        builtins: [{ type: ModuleTypes.BUILTIN, name: 'fs' }],
        locals: [
          {
            type: ModuleTypes.LOCAL,
            path: new FilePath('/project', 'base/module.js'),
          },
          {
            type: ModuleTypes.LOCAL,
            path: new FilePath('/project', 'layer1/module.js'),
          },
          {
            type: ModuleTypes.LOCAL,
            path: new FilePath('/project', 'layer2/module.js'),
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
      meta: {
        rootDir: '/project',
        patterns: [],
      },
      // nodes may be empty
      nodes: [],
      has: () => true,
    }
  },
  layer1(): DLintLayer {
    const pattern = 'layer1/**/*.js'
    return {
      meta: {
        rootDir: '/project',
        patterns: [pattern],
      },
      // nodes may be empty
      nodes: [],
      has(local: LocalModule) {
        return minimatch(local.path.relativePath, pattern)
      },
    }
  },
}
