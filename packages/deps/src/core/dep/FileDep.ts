import { Fanout } from './Fan'

export class FileDep {
  file: string
  fanout: Fanout

  constructor(file: string, fanout: Fanout) {
    this.file = file
    this.fanout = fanout
  }
}
