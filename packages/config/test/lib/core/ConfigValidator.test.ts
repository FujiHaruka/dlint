import {
  ConfigValidator,
  ConfigFieldTypes,
} from '../../../src/core/ConfigValidator'

it('works', () => {
  interface TestConfig {
    str: string
    strs: string[]
    requiredStr: string
  }

  const validator: ConfigValidator<TestConfig> = new ConfigValidator({
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
