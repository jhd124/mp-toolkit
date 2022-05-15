import { StateStore } from '../src/tool-kit/state-store'

describe('测试store', () => {
  const initStore = {
    user: {
      name: "Jack"
    },
    foo: {
      bar: 'bar'
    }
  }
  let store: StateStore<typeof initStore>
  beforeEach(() => {
    store = new StateStore(initStore)
  })

  test('store should be initialized with initStore', () => {
    expect(store.state).toEqual(initStore)
  })

  test('dispatch should update store', () => {
    store.dispatch({user: {name: 'Joe'}})
    expect(store.state).toEqual({
      user: {
        name: 'Joe'
      },
      foo: {
        bar: 'bar'
      }
    })
  })
  
  test('subscribe/unsubscribe should add/remove listener', () => {
    // @ts-expect-error access private member
    const originalListenerNum = store.listeners.length
    const fn = jest.fn()
    store.subscribe(fn)

    // @ts-expect-error access private member
    expect(store.listeners.length).toBe(originalListenerNum + 1)
    
    store.unSubscribe(fn)
    // @ts-expect-error access private member
    expect(store.listeners.length).toBe(originalListenerNum)
    
  })

  test('dispatch should invoke listeners', () => {
    const fn = jest.fn()

    store.subscribe(fn)
    expect(fn).toBeCalledTimes(1)
    expect(fn).toBeCalledWith(initStore)

    store.dispatch({user: {name: 'Joe'}})
    expect(fn).toBeCalledTimes(2)
    expect(fn).toBeCalledWith({
      user: {name: 'Joe'},
      foo: {bar: 'bar'}
    })
  })

})