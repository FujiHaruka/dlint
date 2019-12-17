import { join } from 'path'

import { DLint } from '../../../src/DLint'

it('project01', async () => {
  const dlint = await DLint.init(join(__dirname, '../../fixtures/project02'))
  const disallowed = dlint.run()
  expect(disallowed).toHaveLength(0)
})
