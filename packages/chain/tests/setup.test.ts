import {setup} from '../src/chain/setup'
import {Chain} from '../src/chain/chain'
import {StateStore} from '../src/tool-kit/state-store'
import {EventBus} from '../src/tool-kit/event-bus'
jest.mock('../src/chain/chain.ts')
jest.mock('../src/tool-kit/event-bus.ts')
jest.mock('../src/tool-kit/state-store.ts')

describe('测试setup', () => {
  test('setup函数正确初始化stateStore，eventBus，chain', () => {

    const eventDefine = {}
    const initialState = {}
    const componentOptionInterceptor = (option: any) => {return option}
    const {
      stateStore,
      eventBus,
      chain,
    } = setup({
      eventDefine,
      initialState,
      componentOptionInterceptor
    })
    chain()
    expect(Chain).toHaveBeenCalledWith(eventBus, stateStore, componentOptionInterceptor)
    expect(StateStore).toHaveBeenCalledWith(initialState)
    expect(EventBus).toHaveBeenCalledWith(eventDefine)

  })
})