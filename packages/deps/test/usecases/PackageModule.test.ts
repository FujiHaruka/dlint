import { PackageModule } from '../../src/usecases/PackageModule'

it('works', () => {
  const mod = PackageModule.create('awesome-package')
  expect(PackageModule.is(mod)).toBeTruthy()
})
