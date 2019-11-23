import { LocalModule } from './LocalModule'
import { BuiltinModule } from './BuiltinModule'
import { PackageModule } from './PackageModule'
import { AbstractModule, ModuleTypes } from './AbstractModule'

export interface DLintModuleResolver {
  resolve: (name: string) => Promise<AbstractModule>
}

export class ModuleClassifier {
  resolver: DLintModuleResolver

  constructor({ resolver }: { resolver: DLintModuleResolver }) {
    this.resolver = resolver
  }

  async classify(
    name: string,
  ): Promise<LocalModule | PackageModule | BuiltinModule> {
    const mod = await this.resolver.resolve(name)
    switch (mod.type) {
      case ModuleTypes.BUILTIN:
        return new BuiltinModule(mod.name)
      case ModuleTypes.PACKAGE:
        return new PackageModule(mod.name)
      case ModuleTypes.LOCAL:
        return new LocalModule(mod.name)
    }
  }
}
