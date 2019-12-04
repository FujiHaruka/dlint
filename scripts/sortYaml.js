#!/usr/bin/env node
/**
 * Sort keys in yaml files
 */
'use strict'

const yaml = require('js-yaml')
const fs = require('fs')
const glob = require('fast-glob')

const [,, ...patterns] = process.argv

if (patterns.length === 0) {
  console.error(`USAGE: ./sortYaml.js [patterns...]`)
  process.exit(1)
}

sortYaml(patterns)

function sortYaml(patterns) {
  const yamlFiles = glob.sync(patterns, { ignore: '/node_modules/' })
  for (const file of yamlFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const obj = yaml.safeLoad(content)
    const sorted = yaml.safeDump(obj, {
      'styles': {
        '!!null': 'canonical' // dump null as ~
      },
      sortKeys: true,
    })
    if (content !== sorted) {
      console.log(`Yaml file sorted: ${file}`)
      fs.writeFileSync(file, sorted)
    }
  }
}
