import { EventBus, throttle, debounce } from "../tool-kit"
import { StateStore } from "../tool-kit/state-store"
import { EventPoolDefine, StoreStateDefine } from "../types"
import { MPToolKitOptionProperties, ProcessFunction } from "./types"
import { createMissingWarning } from "./warn-create"

interface LifetimesVisitors<TThis> {
  onLoad(this: TThis): void
  onUnload(this: TThis): void
  attached(this: TThis): void
  detached(this: TThis): void
}

// @createMissingWarning
export class ChainComponent<
  E extends EventPoolDefine,
  S extends StoreStateDefine,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TThis extends WechatMiniprogram.Component.Instance<
    TData,
    TProperty,
    TMethod,
    TCustomInstanceProperty & MPToolKitOptionProperties<E, S>,
    TIsPage
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
  TIsPage extends boolean = false,
> {
  private eventBus
  private stateStore
  private option
  private isPage
  private componentOptionInterceptor
  constructor(
    option: WechatMiniprogram.Component.Options<
      TData,
      TProperty,
      TMethod,
      TCustomInstanceProperty & MPToolKitOptionProperties<E, S>,
      TIsPage
    >, 
    eventBus: EventBus<E>,
    stateStore: StateStore<S>,
    isPage: TIsPage,
    componentOptionInterceptor?: ProcessFunction
  ) {
    this.eventBus = eventBus
    this.option = option
    this.stateStore = stateStore
    this.isPage = isPage
    this.componentOptionInterceptor = componentOptionInterceptor
    const mpKit = {
      eventBus,
      stateStore,
    }
    this.lifetimesTraverse({
      onLoad(){
        this.$mpKit = mpKit
      },
      onUnload(){},
      attached(){
        this.$mpKit = mpKit
      },
      detached(){},
    })
  }

  private lifetimesTraverse(visitors: LifetimesVisitors<TThis>){
    const { option } = this
    const { lifetimes, methods } = option
    if(this.isPage){
      const originalOnLoad = methods?.onLoad
      const originalOnUnload = methods?.onUnload
      // @ts-ignore
      option.methods = {
        ...(methods || {}),
        onLoad(...onLoadArgs){
          // @ts-ignore
          originalOnLoad?.call(this, ...onLoadArgs)
          visitors.onLoad.call(this as TThis)
        },
        onUnload(){
          // @ts-ignore
          originalOnUnload?.call(this)
          visitors.onUnload.call(this as TThis)
        }
      }
    } else {
      const originalAttached = lifetimes?.attached
      const originalDetached = lifetimes?.detached
      option.lifetimes = {
        ...(lifetimes || {}),
        attached: function(){
          visitors.attached.call(this as TThis)
          originalAttached?.call(this)
        },
        detached: function(){
          visitors.detached.call(this as TThis)
          originalDetached?.call(this)
        }
      }
    }
  }

  // def subscribeEvents
  public subscribeEvents<
    K extends keyof E
  >(
    eventName: K, 
    handler: (this: TThis, ...args: Parameters<E[K]>) => any
  ){
    const { eventBus } = this
    let unSubscribe = () => {}

    function addListener(this: TThis){
      const _handler = (...args: Parameters<E[K]>) => handler.call(this, ...args)
      unSubscribe = eventBus.addListener(eventName, _handler as E[K])
    }

    this.lifetimesTraverse({
      attached() {
        addListener.call(this)
      },
      detached() {
        unSubscribe()
      },
      onLoad() {
        addListener.call(this)
      },
      onUnload() {
        unSubscribe()
      }
    })
    return this
  }

  public throttle<
    T extends Record<string, {
      method: (this: TThis, ...args: any[]) => any, 
      time: number
    }>
  >(methodInfo: T = {} as T){
    const throttled: {[k: string]: (...args: any[]) => any} = {}
    for(const k in methodInfo){
      const {method, time} = methodInfo[k]
      throttled[k] = throttle(method, time)
    }
    // @ts-ignore
    this.option.methods = {
      ...(this.option.methods || {}),
      ...throttled
    }
    return this
  }

  public debounce<T extends {
    [k: string]: {
      method: (this: TThis, ...args: any[]) => any, 
      time: number,
      options?: {
        leading: boolean
      }
    }
  }>(methodInfo: T = {} as T){
    const debounced: {[k: string]: (...args: any[]) => any} = {}
    for(const k in methodInfo){
      const {method, time, options} = methodInfo[k]
      debounced[k] = debounce(method, time, options)
    }
    // @ts-ignore
    this.option.methods = {
      ...(this.option.methods || {}),
      ...debounced
    }
    return this
  }

  public subscribeState(handler: (this: TThis, state: S) => void){
    let unSubscribeHandler: () => void
    const { stateStore } = this
    this.lifetimesTraverse({
      onLoad(){
        unSubscribeHandler = stateStore.subscribe(handler.bind(this))
      },
      onUnload(){
        unSubscribeHandler()
      },
      attached(){
        unSubscribeHandler = stateStore.subscribe(handler.bind(this))
      },
      detached(){
        unSubscribeHandler()
      }
    })
    return this
  }

  public create(){
    const options = this.componentOptionInterceptor?.(this.option) || this.option
    return Component(options)
  }
}