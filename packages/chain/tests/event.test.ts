import { EventBus } from '../src/tool-kit/event-bus'

describe('测试event bus', () => {
  const eventDefine = {
    test: (s: string, n: number) => {s;n},
    contract: (s: string, n: number) => {s;n}
  }
  let eventBus: EventBus<typeof eventDefine>
  beforeAll(() => {
    eventBus = new EventBus(eventDefine)
  })
  test('(add/remove)Listener should (add/remove) eventListener', () => {
    // @ts-expect-error access private member
    const originalListenerNum = eventBus.pool.test.length
    const fn = jest.fn((s: string, n: number) => {s; n;})
    eventBus.addListener('test', fn)
    // @ts-expect-error access private member
    expect(eventBus.pool.test.length).toBe(originalListenerNum + 1)
    // @ts-expect-error access private member
    expect(eventBus.pool.test.find(f => f === fn)).toBeTruthy()
    
    eventBus.removeListener('test', fn)
    // @ts-expect-error access private member
    expect(eventBus.pool.test.length).toBe(originalListenerNum)
    // @ts-expect-error access private member
    expect(eventBus.pool.test.find(f => f === fn)).toBeFalsy()

  })

  test('emit should invoke all the listeners', () => {
    const fn1 = jest.fn((s: string, n: number) => {s; n;})
    const fn2 = jest.fn((s: string, n: number) => {s; n;})
    const fn3 = jest.fn((s: string, n: number) => {s; n;})
    eventBus.addListener('test', fn1)
    eventBus.addListener('test', fn2)
    eventBus.addListener('contract', fn3)

    eventBus.emit('test', 's', 0)

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
    expect(fn1).toBeCalledWith('s', 0)
    expect(fn2).toBeCalledWith('s', 0)
    expect(fn3).toBeCalledTimes(0)

  })

})