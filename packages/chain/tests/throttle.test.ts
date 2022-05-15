import { throttle } from '../src/tool-kit/throttle'
import { wait } from './utils'

test('被throttle的函数调用的参数和返回值与原函数无异', () => {
  const mock = jest.fn((n) => 1)
  const fn = throttle(mock, 0)
  expect(fn(0)).toBe(1)
  expect(mock).toBeCalledWith(0)
})

test('设置0间隔被throttle的函数，原函数调用次数等于throttle函数的调用次数', () => {
  const mock = jest.fn()
  const fn = throttle(mock, 0)
  fn(0)
  fn(0)
  expect(mock).toBeCalledTimes(2)
})

test('连续调用被throttle的函数，原函数节流调用', async () => {
  const mock = jest.fn((n) => 1)
  const fn = throttle(mock, 50)
  fn(0)
  fn(0)
  fn(0)
  fn(0)
  fn(0)
  await wait(100)
  fn(0)
  fn(0)
  fn(0)
  fn(0)
  fn(0)
  await wait(100)
  fn(0)
  fn(0)
  fn(0)
  fn(0)
  fn(0)
  await wait(100)
  expect(mock).toBeCalledTimes(3)
})