import path from 'path'

import { ModuleClassifier } from '../../../../src/usecase/module/ModuleClassifier'
import { BuiltinModule } from '../../../../src/core/module/BuiltinModule'
import { PackageModule } from '../../../../src/core/module/PackageModule'
import { LocalModule } from '../../../../src/core/module/LocalModule'

it('works', () => {
  const creator = new ModuleClassifier({ resolver: require })
  expect(BuiltinModule.is(creator.classify('fs'))).toBeTruthy()
  expect(PackageModule.is(creator.classify('jest'))).toBeTruthy()
  expect(LocalModule.is(creator.classify('../../../../package'))).toBeTruthy()
  expect(
    LocalModule.is(
      creator.classify(path.resolve(__dirname, '../../../../package')),
    ),
  ).toBeTruthy()
})
