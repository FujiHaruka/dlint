import {
  DLintConfigFields,
  DLintConfigSchema,
} from '../../../src/core/DLintConfigSchema'

it('works', () => {
  const schema = new DLintConfigSchema()

  expect(
    schema.validate({
      rootDir: '/foo/project',
      include: ['src/**/*.ts'],
      rules: [],
      parser: '',
    }),
  ).toBeTruthy()
  expect(
    schema.fillDefaults({
      rootDir: '/foo/project',
      include: ['src/**/*.ts'],
      rules: [],
      parser: '',
    }),
  ).toEqual({
    rootDir: '/foo/project',
    include: ['src/**/*.ts'],
    exclude: [],
    rules: [],
    parser: '',
  } as DLintConfigFields)

  expect(() =>
    schema.validate({
      rootDir: '/foo/project',
      rules: [],
      parser: '',
    }),
  ).toThrow('"include" field is required')
})
