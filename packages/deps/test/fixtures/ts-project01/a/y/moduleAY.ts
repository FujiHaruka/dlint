import path from 'path'
// 複数回 import しても uniq で潰される
import '@types/node'
import '@types/node'
import '@types/node'

const s: string = 's' // this is typescript

export {
  path
}
export default path
