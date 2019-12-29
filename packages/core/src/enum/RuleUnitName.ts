export enum RuleUnitName {
  AllowAll = 'AllowAll',
  AllowAllLayers = 'AllowAllLayers',
  AllowAllPackages = 'AllowAllPackages',
  AllowAllNodejs = 'AllowAllNodejs',
  AllowAllJson = 'AllowAllJson',
  AllowLayers = 'AllowLayers',
  AllowPackages = 'AllowPackages',
  AllowSelfLayer = 'AllowSelfLayer',
  DisallowAll = 'DisallowAll',
  DisallowAllLayers = 'DisallowAllLayers',
  DisallowAllPackages = 'DisallowAllPackages',
  DisallowAllNodejs = 'DisallowAllNodejs',
  DisallowAllJson = 'DisallowAllJson',
  DisallowLayers = 'DisallowLayers',
  DisallowPackages = 'DisallowPackages',
  DisallowSelfLayer = 'DisallowSelfLayer',
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
      case RuleUnitName.AllowAllJson:
        return 'allow: allJson'
      case RuleUnitName.AllowLayers:
        return 'allow: layers'
      case RuleUnitName.AllowPackages:
        return 'allow: packages'
      case RuleUnitName.AllowSelfLayer:
        return 'allow: selfLayer'
      case RuleUnitName.DisallowAll:
        return 'disallow: all'
      case RuleUnitName.DisallowAllLayers:
        return 'disallow: allLayers'
      case RuleUnitName.DisallowAllNodejs:
        return 'disallow: allNodejs'
      case RuleUnitName.DisallowAllPackages:
        return 'disallow: allPackages'
      case RuleUnitName.DisallowAllJson:
        return 'disallow: allJson'
      case RuleUnitName.DisallowLayers:
        return 'disallow: layers'
      case RuleUnitName.DisallowPackages:
        return 'disallow: packages'
      case RuleUnitName.DisallowSelfLayer:
        return 'disallow: selfLayer'
      default:
        return name as string
    }
  },
}
