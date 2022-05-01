import { EventBus } from '../tool-kit/event-bus'
import { throttle } from '../tool-kit/throttle'
import { debounce } from '../tool-kit/debounce'
import type { EventPoolDefine } from '../types'
import { createMissingWarning } from './warn-create'

export class Chain<E extends EventPoolDefine> {
  private eventBus

  constructor(eventBus: EventBus<E>){
    this.eventBus = eventBus
  }

  public app<T extends WechatMiniprogram.IAnyObject>(option: WechatMiniprogram.App.Options<T, {
    $mpKit: {
      eventBus: EventBus<E>
    }
  }>){
    return new ChainApp({
      ...option,
      $mpKit: {
        eventBus: this.eventBus
      }
    }, this.eventBus)
  }

  public page<
      TData extends WechatMiniprogram.Component.DataOption,
      TProperty extends WechatMiniprogram.Component.PropertyOption,
      TMethod extends WechatMiniprogram.Component.MethodOption,
      TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
  >(option: WechatMiniprogram.Component.Options<
      TData,
      TProperty,
      TMethod,
      TCustomInstanceProperty & {
        $mpKit: {
          eventBus: EventBus<E>
        }
      },
      true
  >) {
    return new ChainComponent({
      ...option,
    }, this.eventBus)
  }

  public component<
      TData extends WechatMiniprogram.Component.DataOption,
      TProperty extends WechatMiniprogram.Component.PropertyOption,
      TMethod extends WechatMiniprogram.Component.MethodOption,
      TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
  >(option: WechatMiniprogram.Component.Options<
      TData,
      TProperty,
      TMethod,
      TCustomInstanceProperty & {
        $mpKit: {
          eventBus: EventBus<E>
        }
      },
      false
  >){
    return new ChainComponent({
      ...option,
    }, this.eventBus)
  }
}
@createMissingWarning
class ChainApp<
  T extends WechatMiniprogram.IAnyObject,
  TExtend extends WechatMiniprogram.IAnyObject,
  E extends EventPoolDefine,
> {
  private eventBus
  private option
  constructor(option: WechatMiniprogram.App.Options<T, TExtend>, eventBus: EventBus<E>){
    this.eventBus = eventBus
    this.option = option
  }

  public subscribeEvents<K extends keyof E, This extends WechatMiniprogram.App.Instance<T, TExtend>>(eventName: K, handler: (this: This, ...args: Parameters<E[K]>) => any){
    const {eventBus} = this
    const { onLaunch } = this.option
    this.option.onLaunch = function(...onLaunchArgs){
      console.log('this', this)
      const _handler = (...args: Parameters<E[K]>) => handler.call(this as This, ...args)
      eventBus.addListener(eventName, _handler as E[K])
      onLaunch?.call(this, ...onLaunchArgs)
    }
    return this
  }

  public create(){
    return App(this.option)
  }
}


@createMissingWarning
class ChainComponent<
  E extends EventPoolDefine,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TThis extends WechatMiniprogram.Component.Instance<
    TData,
    TProperty,
    TMethod,
    TCustomInstanceProperty & {
      $mpKit: {
        eventBus: EventBus<E>
      }
    },
    TIsPage
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
  TIsPage extends boolean = false,
> {
  private eventBus
  private option
  constructor(option: WechatMiniprogram.Component.Options<
    TData,
    TProperty,
    TMethod,
    TCustomInstanceProperty & {
      $mpKit: {
        eventBus: EventBus<E>
      }
    },
    TIsPage
  >, eventBus: EventBus<E>) {
    console.log('this', this)
    this.eventBus = eventBus
    this.option = option
  }

  // def subscribeEvents
  public subscribeEvents<
    K extends keyof E, 
    T extends TThis
  >(eventName: K, handler: (this: T, ...args: Parameters<E[K]>) => any){
    const {eventBus, option} = this
    const { lifetimes } = option
    let unSubscribe = () => {}
    if(lifetimes?.attached){

      const originalAttached = lifetimes.attached
      lifetimes.attached = function(this: T, ...attachArgs){

        const ret = originalAttached(...attachArgs)
        const _handler = (...args: Parameters<E[K]>) => handler.call(this, ...args)
        unSubscribe = eventBus.addListener(eventName, _handler as E[K])
        this.$mpKit = {
          eventBus
        }
        return ret
      }
    }
    if (lifetimes?.detached) {
      const originalDetached = lifetimes.detached
      lifetimes.detached = function(...detachArgs){
        const ret = originalDetached(...detachArgs)
        unSubscribe?.()
        return ret
      }
    }
    console.log('this.option', this.option)
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

  public create(){
    return Component(this.option)
  }
}


