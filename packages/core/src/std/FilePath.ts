import { join, isAbsolute, relative } from 'path'

enum FileTypes {
  FILE,
  DIRECTORY,
}

export class FilePath {
  readonly rootDir: string
  readonly relativePath: string
  private readonly type: FileTypes

  constructor(rootDir: string, path: string, isFile = true) {
    this.rootDir = rootDir
    this.relativePath = isAbsolute(path) ? relative(rootDir, path) : path
    this.type = isFile ? FileTypes.FILE : FileTypes.DIRECTORY
  }

  isFile() {
    return this.type === FileTypes.FILE
  }

  isDirectory() {
    return this.type === FileTypes.DIRECTORY
  }

  get absolutePath() {
    return join(this.rootDir, this.relativePath)
  }

  toString() {
    return this.relativePath
  }

  toJSON() {
    return this.toString()
  }
}
