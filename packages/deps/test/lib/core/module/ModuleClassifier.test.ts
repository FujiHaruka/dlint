import path from 'path'

import { ModuleClassifier } from '../../../../src/core/module/ModuleClassifier'
import { BuiltinModule } from '../../../../src/core/module/BuiltinModule'
import { PackageModule } from '../../../../src/core/module/PackageModule'
import { LocalModule } from '../../../../src/core/module/LocalModule'
import { MockModuleResolver } from '../../../tools/MockModuleResolver'

it('works', async () => {
  const classifier = new ModuleClassifier({
    resolver: new MockModuleResolver({ rootFile: '/project/root.js' }),
  })
  expect(BuiltinModule.is(await classifier.classify('fs'))).toBeTruthy()
  expect(PackageModule.is(await classifier.classify('jest'))).toBeTruthy()
  expect(LocalModule.is(await classifier.classify('./foo'))).toBeTruthy()
  expect(LocalModule.is(await classifier.classify('..'))).toBeTruthy()
})
