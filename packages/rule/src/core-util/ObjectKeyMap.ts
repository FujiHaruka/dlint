/**
 * Map of which key is ValueObject
 */
export class ObjectKeyMap<K, V> {
  private toKeyString: (valueObject: K) => string
  private keyMap: Map<string, K>
  private valueMap: Map<string, V>

  constructor(toKeyString: (valueObject: K) => string) {
    this.toKeyString = toKeyString
    this.keyMap = new Map()
    this.valueMap = new Map()
  }

  get size() {
    return this.valueMap.size
  }

  delete(key: K) {
    const keyStr = this.toKeyString(key)
    const has = this.has(key)
    this.keyMap.delete(keyStr)
    this.valueMap.delete(keyStr)
    return has
  }

  entries(): [K, V][] {
    return Array.from(this.keyMap.entries()).map(([keyStr, key]) => {
      const value = this.valueMap.get(keyStr)
      if (!value) {
        throw new Error('never')
      }
      return [key, value]
    })
  }

  get(key: K): V | undefined {
    return this.valueMap.get(this.toKeyString(key))
  }

  has(key: K) {
    return this.valueMap.has(this.toKeyString(key))
  }

  keys() {
    return Array.from(this.keyMap.values())
  }

  set(key: K, value: V) {
    this.keyMap.set(this.toKeyString(key), key)
    this.valueMap.set(this.toKeyString(key), value)
    return this
  }

  values() {
    return Array.from(this.valueMap.values())
  }
}
