export enum RuleUnitName {
  AllowAll = 'AllowAll',
  AllowAllLayers = 'AllowAllLayers',
  AllowAllPackages = 'AllowAllPackages',
  AllowAllNodejs = 'AllowAllNodejs',
  AllowLayers = 'AllowLayers',
  AllowPackages = 'AllowPackages',
  DisallowAll = 'DisallowAll',
  DisallowAllLayers = 'DisallowAllLayers',
  DisallowAllPackages = 'DisallowAllPackages',
  DisallowAllNodejs = 'DisallowAllNodejs',
  DisallowLayers = 'DisallowLayers',
  DisallowPackages = 'DisallowPackages',
}

export const RuleUnitNameUtil = {
  format(name: RuleUnitName): string {
    switch (name) {
      case RuleUnitName.AllowAll:
        return 'allow: all'
      case RuleUnitName.AllowAllLayers:
        return 'allow: allLayers'
      case RuleUnitName.AllowAllNodejs:
        return 'allow: allNodejs'
      case RuleUnitName.AllowAllPackages:
        return 'allow: allPackages'
      case RuleUnitName.AllowLayers:
        return 'allow: layers'
      case RuleUnitName.AllowPackages:
        return 'allow: packages'
      case RuleUnitName.DisallowAll:
        return 'disallow: all'
      case RuleUnitName.DisallowAllLayers:
        return 'disallow: allLayers'
      case RuleUnitName.DisallowAllNodejs:
        return 'disallow: allNodejs'
      case RuleUnitName.DisallowAllPackages:
        return 'disallow: allPackages'
      case RuleUnitName.DisallowLayers:
        return 'disallow: layers'
      case RuleUnitName.DisallowPackages:
        return 'disallow: packages'
      default:
        return name as string
    }
  },
}
