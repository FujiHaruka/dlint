import { PackageModule } from '../../../src/core/module/PackageModule'

it('works', () => {
  const mod = new PackageModule('awesome-package')
  expect(PackageModule.is(mod)).toBeTruthy()
})
