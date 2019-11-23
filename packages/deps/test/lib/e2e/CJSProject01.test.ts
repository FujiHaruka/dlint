import { resolve } from 'path'

import { gatherDeps } from '../../../src/Deps'

it('works', async () => {
  const deps = await gatherDeps(['**/*.js'], {
    cwd: resolve(__dirname, '../../fixtures/cjs-project01'),
  })
  // TODO
  console.log(JSON.stringify(deps, null, 2))
})
