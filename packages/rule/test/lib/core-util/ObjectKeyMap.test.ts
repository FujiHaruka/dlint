import { ObjectKeyMap } from '../../../src/core-util/ObjectKeyMap'

it('works', () => {
  interface Person {
    name: string
  }
  const map = new ObjectKeyMap<Person, Person>((person: Person) => person.name)

  expect(map.size).toBe(0)

  const alice = { name: 'Alice' }
  const bob = { name: 'Bob' }
  const charlie = { name: 'Charlie' }
  const dave = { name: 'Dave' }

  map.set(alice, bob).set(charlie, dave)
  expect(map.get(alice)).toEqual(bob)
  expect(map.get(charlie)).toEqual(dave)
  expect(map.get(bob)).toBeUndefined()
  expect(map.has(alice)).toBeTruthy()
  expect(map.size).toBe(2)
  expect(map.keys()).toEqual([alice, charlie])
  expect(map.values()).toEqual([bob, dave])
  expect(map.entries()).toEqual([
    [alice, bob],
    [charlie, dave],
  ])

  expect(map.delete(bob)).toBeFalsy()
  expect(map.delete(alice)).toBeTruthy()
  expect(map.size).toBe(1)
  expect(map.get(alice)).toBeUndefined()
  expect(map.keys()).toEqual([charlie])

  map.set(charlie, bob)
  expect(map.size).toBe(1)
  expect(map.get(charlie)).toEqual(bob)
})
