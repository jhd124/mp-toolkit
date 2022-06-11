import { EventBus } from "../src/tool-kit/event-bus";
import { StateStore } from "../src/tool-kit/state-store";
import { Chain } from '../src/chain/chain';
import '@mp-toolkit/mp-type';
import { wait } from "./utils";

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
  let eventBus: EventBus<typeof eventDefine>
  let stateStore: StateStore<typeof initialState>
  beforeEach(() => {
    eventBus = new EventBus(eventDefine)
    stateStore = new StateStore(initialState)
    chain = new Chain(eventBus, stateStore)

  })

  test('App的options保留传给chain.app的属性', () => {
    const appInstance = chain.app({
      someString: 'someString',
    })
    appInstance.create()
    // @ts-expect-error 检查私有属性
    expect(appInstance.option).toHaveProperty('someString')
  })
  
  test('App中chain方法的this都是组件实例', () => {
    let onLaunchThis: any
    const onLaunch = jest.fn(function(this: any){
      onLaunchThis = this
    })
    let eventHandlerThis: any
    const eventHandler = jest.fn(function(this: any){
      eventHandlerThis = this
    })
    let stateListenerThis: any
    const stateListener = jest.fn(function(this: any){
      stateListenerThis = this
    })

    chain.app({
      someString: 'someString',
      onLaunch
    })
    .subscribeEvents('event', eventHandler)
    .subscribeState(stateListener)
    .create()

    eventBus.emit('event', 's')

    expect(onLaunchThis.isInAppClassInstance).toBe(true)
    expect(eventHandlerThis.isInAppClassInstance).toBe(true)
    expect(stateListenerThis.isInAppClassInstance).toBe(true)
  })

  test('Page/Component的options保留传给chain.page/component的属性', () => {
    const option = {
      data: {
        s: ''
      },
      properties: {
        p: {
          type: String,
          value: ''
        }
      },
      methods: {
        fn(){},
      },
    }

    const appInstance = chain.page(option)
    appInstance.create()
    // @ts-expect-error 检查私有属性
    expect(appInstance.option.data.s).toEqual(option.data.s)
    // @ts-expect-error 检查私有属性
    expect(appInstance.option.properties.p).toEqual(option.properties.p)
    // @ts-expect-error 检查私有属性
    expect(appInstance.option.methods.fn).toEqual(option.methods.fn)

  })

  test('page中chain的各方法正确调用', async () => {
    let onLoadThis: any
    const onLoad = jest.fn(function(this: any){
      onLoadThis = this
    })
    let onUnloadThis: any
    const onUnload = jest.fn(function(this: any){
      eventBus.emit('event', 'string')
      onUnloadThis = this
    })
    let eventHandlerThis: any
    const eventHandler = jest.fn(function(this: any){
      eventHandlerThis = this
    })
    let stateListenerThis: any
    const stateListener = jest.fn(function(this: any){
      stateListenerThis = this
    })
    let debounceThis: any
    const debounce = jest.fn(function(this: any){
      debounceThis = this
    })
    let throttleThis: any
    const throttle = jest.fn(function(this: any){
      throttleThis = this
    })

    chain.page({
      data: {a: 1},
      methods: {
        onLoad,
        onUnload
      }
    })
    .subscribeEvents('event', eventHandler)
    .subscribeState(stateListener)
    .debounce({
      request: {
        method: debounce,
        time: 0
      },
      tap: {
        method: debounce,
        time: 1,
        options: {
          leading: true
        }
      }
    })
    .throttle({
      animate: {
        method: throttle,
        time: 60
      }
    })
    .create()

    await wait(100)

    expect(onLoadThis.isInAppClassInstance).toBe(true)
    expect(onUnloadThis.isInAppClassInstance).toBe(true)
    expect(eventHandlerThis.isInAppClassInstance).toBe(true)
    expect(stateListenerThis.isInAppClassInstance).toBe(true)
    expect(debounceThis.isInAppClassInstance).toBe(true)
    expect(throttleThis.isInAppClassInstance).toBe(true)

    expect(onLoad).toBeCalledWith('a=1')
    expect(eventHandler).toBeCalledWith('string')
    expect(stateListener.mock.calls[0]).toEqual([initialState])
    expect(debounce).toBeCalledWith('arg')
    expect(throttle).toBeCalledWith('arg')
  })

  test('component中chain的各方法正确调用', async () => {
    let attachedThis: any
    const attached = jest.fn(function(this: any){
      attachedThis = this
    })
    let detachedThis: any
    const detached = jest.fn(function(this: any){
      eventBus.emit('event', 'string')
      detachedThis = this
    })
    let eventHandlerThis: any
    const eventHandler = jest.fn(function(this: any){
      eventHandlerThis = this
    })
    let stateListenerThis: any
    const stateListener = jest.fn(function(this: any){
      stateListenerThis = this
    })
    let debounceThis: any
    const debounce = jest.fn(function(this: any){
      debounceThis = this
    })
    let throttleThis: any
    const throttle = jest.fn(function(this: any){
      throttleThis = this
    })

    chain.page({
      data: {a: 1},
      lifetimes: {
        attached,
        detached
      }
    })
    .subscribeEvents('event', eventHandler)
    .subscribeState(stateListener)
    .debounce({
      request: {
        method: debounce,
        time: 0
      },
      tap: {
        method: debounce,
        time: 1,
        options: {
          leading: true
        }
      }
    })
    .throttle({
      animate: {
        method: throttle,
        time: 60
      }
    })
    .create()

    await wait(100)

    expect(attachedThis.isInAppClassInstance).toBe(true)
    expect(detachedThis.isInAppClassInstance).toBe(true)
    expect(eventHandlerThis.isInAppClassInstance).toBe(true)
    expect(stateListenerThis.isInAppClassInstance).toBe(true)
    expect(debounceThis.isInAppClassInstance).toBe(true)
    expect(throttleThis.isInAppClassInstance).toBe(true)

    expect(eventHandler).toBeCalledWith('string')
    expect(stateListener.mock.calls[0]).toEqual([initialState])
    expect(debounce).toBeCalledWith('arg')
    expect(throttle).toBeCalledWith('arg')
  })

  test('componentOptionInterceptor', () => {
    let onLoadSpyThis: any
    let attachedSpyThis: any
    const onLoadSpy = jest.fn(function(this: any) {
      onLoadSpyThis = this
    })
    const attachedSpy = jest.fn(function(this: any){
      attachedSpyThis = this
    })

    let onLoadThis: any
    let attachedThis: any
    const onLoad = jest.fn(function(this: any) {
      onLoadThis = this
    })
    const attached = jest.fn(function(this: any){
      attachedThis = this
    })

    new Chain(eventBus, stateStore, function(option){
      const originalAttached = option.lifetimes?.attached
      const originalOnload = option.methods?.onLoad
      option={
        ...option,
        lifetimes: {
          attached(){
            attachedSpy.call(this)
            originalAttached?.call(this)
          }
        },
        methods: {
          ...(option.methods || {}),
          onLoad(...args: any[]){
            onLoadSpy.call(this)
            originalOnload?.call(this, ...args)
          } 
        }
      }

      return option
    })
    .page({
      lifetimes: {
        attached
      },
      methods: {
        onLoad
      }
    })
    .create()

    expect(onLoad).toBeCalledWith('a=1')

    expect(attached).toHaveBeenCalled()
    expect(attachedSpy).toHaveBeenCalled()

    expect(onLoadSpyThis.isInAppClassInstance).toBe(true)
    expect(attachedSpyThis.isInAppClassInstance).toBe(true)
    expect(onLoadThis.isInAppClassInstance).toBe(true)
    expect(attachedThis.isInAppClassInstance).toBe(true)



  })


})
