import {
  DLintModule,
  DLintModuleUtil,
  DLintNode,
  ObjectKeyMap,
} from '@dlint/core'

export enum RuleAllowanceStatus {
  ALLOWED = 'allowed',
  DISALLOWED = 'disallowed',
}

/**
 * Status of applying a rule unit to a DLintModule
 */
interface ModuleAppliedStatus {
  ruleUnitName: string
  status: RuleAllowanceStatus
  module: DLintModule
}

export interface DisallowedResult {
  node: DLintNode
  statuses: {
    ruleUnitName: string
    module: DLintModule
  }[]
}

/**
 * Result of applying a specific rule unit to a DLintNode
 */
export class NodeAppliedResult {
  node: DLintNode
  ruleUnitName: string
  private moduleStatusMap: ObjectKeyMap<DLintModule, ModuleAppliedStatus>

  constructor(node: DLintNode, ruleUnitName: string) {
    this.node = node
    this.ruleUnitName = ruleUnitName
    this.moduleStatusMap = new ObjectKeyMap<DLintModule, ModuleAppliedStatus>(
      DLintModuleUtil.toKeyString,
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

  statuses() {
    return this.moduleStatusMap.values()
  }
}

/**
 * Reduce NodeAppliedResult array to single result
 */
export const reduceDisallowedResults = (
  node: DLintNode,
  results: NodeAppliedResult[],
): DisallowedResult => {
  if (results.length === 0) {
    return {
      node,
      statuses: [],
    }
  }
  const invalidResult = results.find(
    (result) => result.node.file.absolutePath !== node.file.absolutePath,
  )
  if (invalidResult) {
    throw new Error(
      `Different node: ${results[0].node.file.absolutePath} != ${invalidResult.node.file.absolutePath}`,
    )
  }
  const map = new ObjectKeyMap<DLintModule, ModuleAppliedStatus>(
    DLintModuleUtil.toKeyString,
  )
  for (const result of results) {
    for (const status of result.statuses()) {
      map.set(status.module, status)
    }
  }
  return {
    node,
    statuses: map
      .values()
      .filter((module) => module.status === RuleAllowanceStatus.DISALLOWED),
  }
}
