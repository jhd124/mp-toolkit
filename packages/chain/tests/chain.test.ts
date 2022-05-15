import { EventBus } from "../src/tool-kit/event-bus";
import { StateStore } from "../src/tool-kit/state-store";
import { Chain } from '../src/chain/chain';

describe('测试Chain', () => {
  const eventDefine = {
    event: (s: string) => {s}
  }
  const initialState = {
    user: {
      name: 'Joe'
    }
  }
  let chain: Chain<typeof eventDefine, typeof initialState>
  beforeEach(() => {
    console.log('global', globalThis.__A)
    const eventBus = new EventBus(eventDefine)
    const stateStore = new StateStore(initialState)
    chain = new Chain(eventBus, stateStore)
  })

  test('app', () => {
    let _this
    const fn = jest.fn(function(){
      _this = this
    })
    const appInstance = chain.app({
      someString: 'someString',
      onLaunch: fn
    })
    appInstance.create()

  })

})