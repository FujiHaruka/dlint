import { Fanin, Fanout } from './Fan'

export interface DepNode {
  fanin: Fanin
  fanout: Fanout
}
