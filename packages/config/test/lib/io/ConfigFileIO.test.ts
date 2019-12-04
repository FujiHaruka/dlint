import { join } from 'path'

import {
  DLintConfigFields,
  DLintConfigSchema,
} from '../../../src/core/DLintConfigSchema'
import { ConfigFileIO } from '../../../src/io/ConfigFileIO'

it('fromJSON', () => {
  // const io = new ConfigFileIO(DLintConfigSchema)
  // const config = io.fromObject({
  //   rootDir: '/foo/project',
  //   include: ['src/**/*.ts'],
  //   rules: [],
  //   parser: '',
  // })
  // expect(config).toEqual({
  //   rootDir: '/foo/project',
  //   include: ['src/**/*.ts'],
  //   exclude: [],
  //   rules: [],
  //   parser: '',
  // } as DLintConfigFields)
  // expect(() =>
  //   io.fromObject({
  //     rootDir: '/foo/project',
  //     rules: [],
  //     parser: '',
  //   }),
  // ).toThrow('"include" field is required')
})

it('fromJsonFile', async () => {
  // const io = new ConfigFileIO(DLintConfigSchema)
  // const config = await io.fromJsonFile(
  //   join(__dirname, '../../fixtures/dlintrc.1.json'),
  // )
  // expect(config).toEqual({
  //   include: ['src/**/*.ts'],
  //   exclude: ['**/__test__/**/*'],
  //   rules: [],
  // })
})
