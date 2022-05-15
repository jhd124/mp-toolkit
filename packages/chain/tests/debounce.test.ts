import { debounce } from '../src/tool-kit/debounce'
import { wait } from './utils'

describe('测试tail debounce', () => {
  let fn
  const mock = jest.fn()
  beforeEach(() => {
    fn = debounce(mock, 500)
    mock.mockReset()
  })
  test('连续5次调用debounce后的函数，原函数只被调用一次', async () => {
    fn(0);
    fn(0);
    fn(0);
    fn(0);
    fn(0);
    await wait(600)
    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith(0)
  })
  test('间隔600毫秒的两次调用，原函数被调用2次', async () => {
    fn(0);
    await wait(600)
    expect(mock).toBeCalledTimes(1)

    fn(0)
    await wait(600)
    expect(mock).toBeCalledTimes(2)
  })
})

describe('测试lead debounce', () => {
  let fn
  const mock = jest.fn()
  beforeEach(() => {
    fn = debounce(mock, 500, {leading: true})
    mock.mockReset()
  })
  test('连续5次调用debounce后的函数，原函数只被调用一次', () => {
    fn(0);
    fn(0);
    fn(0);
    fn(0);
    fn(0)
    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith(0)
  })
  test('间隔600毫秒的两次调用，原函数被调用2次', async () => {
    fn(0);
    expect(mock).toBeCalledTimes(1)
    await wait(600)
    fn(0)
    expect(mock).toBeCalledTimes(2)
  })
})