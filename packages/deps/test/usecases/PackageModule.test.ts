import { PackageModule } from '../../src/usecases/PackageModule'

it('works', () => {
  const mod = new PackageModule('awesome-package')
  expect(PackageModule.is(mod)).toBeTruthy()
})
