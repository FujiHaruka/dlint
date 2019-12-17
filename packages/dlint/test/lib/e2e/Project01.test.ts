import { join } from 'path'

import { RuleUnitName } from '@dlint/core'

import { DLint } from '../../../src/DLint'

it('project01', async () => {
  const dlint = await DLint.init(join(__dirname, '../../fixtures/project01'))
  const disallowed = dlint.applyRule()
  expect(disallowed).toHaveLength(1)
  expect(disallowed[0]).toMatchObject({
    statuses: [
      {
        ruleUnitName: RuleUnitName.DisallowAll,
        module: {
          name: 'fs',
        },
      },
    ],
  })
})
