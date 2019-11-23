import Module from 'module'
import { promises as fs } from 'fs'
import { join, dirname } from 'path'

import { DLintModule, ModuleTypes } from '../core/module/DLintModule'
import { DLintModuleResolver } from '../core/module/DLintModuleResolver'

const ModulePrefixes = {
  ABSOLUTE: '/',
  RELATIVE: './',
  RELATIVE_UP: '../',
}
const SpecialModules = {
  CURRENT_DIR: '.',
  UPPER_DIR: '..',
}

const ModuleNotFoundError = (name: string): Error => {
  const err = new Error(`Cannot find module '${name}'`)
  Object.assign(err, {
    code: 'MODULE_NOT_FOUND',
  })
  return err
}

export interface ModuleResolveOptions {
  ext?: string[]
}

const isFile = (filepath: string): Promise<boolean> =>
  fs
    .lstat(filepath)
    .then((stat) => stat.isFile())
    .catch(() => false)
const isDirectory = (filepath: string): Promise<boolean> =>
  fs
    .lstat(filepath)
    .then((stat) => stat.isDirectory())
    .catch(() => false)

export class ModuleResolver implements DLintModuleResolver {
  static DEFAULT_EXTENSIONS = [
    '',
    '.js',
    '.json',
    '.node',
    '.mjs',
    '.jsx',
    '.ts',
    '.tsx',
  ]
  static INDEX_BASENAME = 'index'
  static PACKAGE_JSON = 'package.json'

  extensions: string[]

  constructor(options: ModuleResolveOptions = {}) {
    this.extensions = options.ext || ModuleResolver.DEFAULT_EXTENSIONS
  }

  private async resolveAsFile(name: string): Promise<string | null> {
    const pathCandidates = this.extensions.map((ext) => name + ext)
    for (const path of pathCandidates) {
      if (await isFile(path)) {
        return path
      }
    }
    return null
  }

  private async resolveIndex(name: string): Promise<string | null> {
    return this.resolveAsFile(join(name, ModuleResolver.INDEX_BASENAME))
  }

  private async resolveAsDirectory(name: string): Promise<string | null> {
    if (!(await isDirectory(name))) {
      return null
    }
    const packageJsonPath = join(name, ModuleResolver.PACKAGE_JSON)
    if (await isFile(packageJsonPath)) {
      const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
      const main = pkg.main as string | undefined
      if (!main) {
        return this.resolveIndex(name)
      }
      const mainPath = join(name, main)
      {
        const resolved = await this.resolveAsFile(mainPath)
        if (resolved) {
          return resolved
        }
      }
      {
        const resolved = await this.resolveIndex(mainPath)
        if (resolved) {
          return resolved
        }
      }
      throw ModuleNotFoundError(name)
    }
    return this.resolveIndex(name)
  }

  private resolveModuleType(name: string): ModuleTypes {
    const isAbsolute = name.startsWith(ModulePrefixes.ABSOLUTE)
    if (isAbsolute) {
      return ModuleTypes.PACKAGE
    }
    const isRelative =
      name.startsWith(ModulePrefixes.RELATIVE) ||
      name.startsWith(ModulePrefixes.RELATIVE_UP) ||
      name === SpecialModules.CURRENT_DIR ||
      name === SpecialModules.UPPER_DIR
    if (isRelative) {
      // 相対パスのみローカルモジュールとする
      return ModuleTypes.LOCAL
    }
    const isBuilin = Module.builtinModules.includes(name)
    if (isBuilin) {
      return ModuleTypes.BUILTIN
    }
    return ModuleTypes.PACKAGE
  }

  async resolve(from: string, name: string): Promise<DLintModule> {
    const root = dirname(from)
    const type = this.resolveModuleType(name)
    if (type === ModuleTypes.LOCAL) {
      const absPath = join(root, name)
      {
        const resolved = await this.resolveAsFile(absPath)
        if (resolved) {
          return {
            type,
            path: resolved,
          }
        }
      }
      {
        const resolved = await this.resolveAsDirectory(absPath)
        if (resolved) {
          return {
            type,
            path: resolved,
          }
        }
      }
      throw ModuleNotFoundError(absPath)
    }
    return {
      type,
      name,
    }
  }
}
