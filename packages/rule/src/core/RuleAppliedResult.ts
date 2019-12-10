import { DepNode } from '@dlint/layer/build/core/dep/DepNode'
import {
  DLintModule,
  toKeyString,
} from '@dlint/layer/build/core/module/DLintModule'

import { ObjectKeyMap } from '../core-util/ObjectKeyMap'

export enum RuleAllowanceStatus {
  ALLOWED = 'allowed',
  DISALLOWED = 'disallowed',
  UNCONCERN = 'unconcern',
}

/**
 * Status of applying a rule unit to a DLintModule
 */
interface ModuleAppliedStatus {
  ruleUnitName: string
  status: RuleAllowanceStatus
  module: DLintModule
}

/**
 * Result of applying a specific rule unit to a DepNode
 */
export class NodeAppliedResult {
  node: DepNode
  ruleUnitName: string
  private moduleStatusMap: ObjectKeyMap<DLintModule, ModuleAppliedStatus>

  constructor(node: DepNode, ruleUnitName: string) {
    this.node = node
    this.ruleUnitName = ruleUnitName
    this.moduleStatusMap = new ObjectKeyMap<DLintModule, ModuleAppliedStatus>(
      toKeyString,
    )
  }

  allow(module: DLintModule) {
    this.moduleStatusMap.set(module, {
      status: RuleAllowanceStatus.ALLOWED,
      ruleUnitName: this.ruleUnitName,
      module,
    })
  }

  disallow(module: DLintModule) {
    this.moduleStatusMap.set(module, {
      status: RuleAllowanceStatus.DISALLOWED,
      ruleUnitName: this.ruleUnitName,
      module,
    })
  }

  unconcern(module: DLintModule) {
    this.moduleStatusMap.set(module, {
      status: RuleAllowanceStatus.UNCONCERN,
      ruleUnitName: this.ruleUnitName,
      module,
    })
  }

  statuses() {
    return this.moduleStatusMap.values()
  }

  override(another: NodeAppliedResult): NodeAppliedResult {
    // TODO: このクラスにあるべきではない
    const { node } = this
    if (node.file.absolutePath !== another.node.file.absolutePath) {
      throw new Error(
        `Different node: ${node.file.absolutePath} != ${another.node.file.absolutePath}`,
      )
    }
    const result = new NodeAppliedResult(node, 'special')
    for (const { status, module } of this.statuses()) {
      switch (status) {
        case RuleAllowanceStatus.ALLOWED:
          result.allow(module)
          continue
        case RuleAllowanceStatus.DISALLOWED:
          result.disallow(module)
          continue
        case RuleAllowanceStatus.UNCONCERN:
          result.unconcern(module)
          continue
      }
    }
    for (const { status, module } of another.statuses()) {
      switch (status) {
        case RuleAllowanceStatus.ALLOWED:
          result.allow(module)
          continue
        case RuleAllowanceStatus.DISALLOWED:
          result.disallow(module)
          continue
        case RuleAllowanceStatus.UNCONCERN:
          // do nothing
          continue
      }
    }
    return result
  }
}
