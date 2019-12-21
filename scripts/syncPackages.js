#!/usr/bin/env node

const { promises: fs } = require('fs')
const { resolve } = require('path')

const glob = require('fast-glob')

const { exec } = require('child_process')
const execAsync = require('util').promisify(exec)

const updateFile = (path) => async (cb) => {
  const content = await fs.readFile(path, 'utf-8')
  const updated = cb(content)
  await fs.writeFile(path, updated)
  return content === updated
}
const asJson = (cb) => (str) => {
  const json = JSON.parse(str)
  const updated = cb(json)
  return JSON.stringify(updated)
}

async function syncPackage(mainPkg) {
  const fields = [
    'author',
    'version',
    'license',
    'bugs',
    'keywords',
    'engines',
    'publishConfig',
  ]
  const packagePaths = glob.sync('packages/*/package.json', {
    cwd: resolve(__dirname, '..'),
  })
  for (const path of packagePaths) {
    const sync = (pkg) => {
      for (const field of fields) {
        pkg[field] = mainPkg[field]
      }
      pkg.files = ['build', 'bin']
      const name = path.match(/packages\/(\w+)\//)[1]
      pkg.homepage = `https://github.com/FujiHaruka/dlint/tree/master/packages/${name}#readme`
      pkg.private = false
      pkg.scripts = {
        build: 'tsc -b',
        clean: 'tsc -b --clean',
        prepare: 'yarn build',
        test: `jest --silent false --config ../../jest.config.js packages/${name}`,
      }
      // @dlint/* のバージョンも強制的に合わせる
      const internalDeps = Object.keys(pkg.dependencies).filter((name) => name.startsWith('@dlint/'))
      for (const dep of internalDeps) {
        pkg.dependencies[dep] = mainPkg.version
      }
      return pkg
    }
    const update = updateFile(path)
    await update(asJson(sync))
    await execAsync(`npx fixpack ${path}`)
  }
}

process.chdir(resolve(__dirname, '..'))

syncPackage(require('../package.json'))
