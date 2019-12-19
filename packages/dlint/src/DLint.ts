import { DLintError } from '@dlint/core'
import { DLintConfig } from '@dlint/config'
import { DLintLayer } from '@dlint/layer'
import { DLintRule, LayerRuleBinding } from '@dlint/rule'

import { Debugger } from './util/Debugger'

const loadLayers = async (config: DLintConfig) => {
  const { expressions, options } = config.layers()
  const layers = await Promise.all(
    expressions.map(({ name, patterns }) =>
      DLintLayer.gatherDeps(name, patterns, options),
    ),
  )
  return layers
}
const bindRule = (config: DLintConfig, layers: DLintLayer[]) => {
  const rules = config.rules()
  const bindings: LayerRuleBinding[] = layers.map((layer) => ({
    layer,
    expressions: rules[layer.name] || [],
  }))
  const rule = new DLintRule(bindings)
  return rule
}

interface DLintOptions {
  verbose: boolean
}

export class DLint {
  layers: DLintLayer[]
  rule: DLintRule
  debug: (...msgs: string[]) => void

  private constructor(
    layers: DLintLayer[],
    rule: DLintRule,
    options: DLintOptions,
  ) {
    this.layers = layers
    this.rule = rule
    this.debug = Debugger(options.verbose)
  }

  static async init(configPath: string, options: { verbose: boolean }) {
    const { verbose } = options
    const debug = Debugger(verbose)
    const config = await DLintConfig.load(configPath)
    debug('Loaded config')
    debug(JSON.stringify(config))
    const layers = await loadLayers(config)
    debug('Loaded layers')
    debug(JSON.stringify(layers))
    const rule = bindRule(config, layers)
    const lint = new this(layers, rule, options)
    return lint
  }

  applyRule(): DLintError[] {
    const { rule, layers, debug } = this
    const disallowed = layers.map((layer) => rule.apply(layer)).flat()
    debug('Allied')
    debug(JSON.stringify(disallowed))
    return disallowed
  }
}
