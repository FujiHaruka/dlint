import { ConfigSchema, ConfigFieldTypes } from '../../../src/core/ConfigSchema'

it('validate', () => {
  interface TestConfig {
    str: string
    strs: string[]
    requiredStr: string
  }

  const validator: ConfigSchema<TestConfig> = new ConfigSchema<TestConfig>({
    str: {
      type: ConfigFieldTypes.STRING,
    },
    strs: {
      type: ConfigFieldTypes.STRING_LIST,
      default: [],
    },
    requiredStr: {
      type: ConfigFieldTypes.STRING,
      required: true,
    },
  })

  validator.validate({
    requiredStr: 'a',
  })
  validator.validate({
    str: 'a',
    strs: ['a'],
    requiredStr: 'a',
  })

  expect(() => validator.validate({})).toThrow()
  expect(() => validator.validate({ requiredStr: 1 })).toThrow()
  expect(() => validator.validate({ str: 1, requiredStr: '1' })).toThrow()
  expect(() =>
    validator.validate({ strs: ['a', 1], requiredStr: 'a' }),
  ).toThrow()
  expect(() =>
    validator.validate({ requiredStr: 'a', additional: 1 }),
  ).toThrow()
})

it('fill defaults', () => {
  interface TestConfig {
    foo: string
    bar: string[]
  }

  const validator: ConfigSchema<TestConfig> = new ConfigSchema<TestConfig>({
    foo: {
      type: ConfigFieldTypes.STRING,
      default: 'foo',
    },
    bar: {
      type: ConfigFieldTypes.STRING_LIST,
      default: ['bar'],
    },
  })

  expect(validator.fillDefaults({})).toEqual({
    foo: 'foo',
    bar: ['bar'],
  })
})
