import fs from 'fs'

// This code is just for checking eslint and typescript
export class Deps {
  constructor() {
    console.log(1)
  }
  read(): string {
    const content = fs.readFileSync('foo.txt')
    return content.toString()
  }
}
