import { EventBus } from './event'
import type { EventBus as EventBusClass } from './event'
import type { EventPoolDefine } from './types'

function getIDGenerator(){
  let currentCount = 0
  return () => currentCount++
}

const IDGenerator = getIDGenerator()


type ConstructorType = 'App' | 'Page' | 'Component' | undefined

class ComponentTreeNode{
  public ID
  public parent
  public children = []
  constructor(parent: any){
    this.ID = IDGenerator()
    this.parent = parent
  }
}

export class Chain<E extends EventPoolDefine> {
  private constructorType: ConstructorType
  private refs = {}
  private eventBus
  constructor(eventBus: EventBus<E>){
    this.eventBus = eventBus
  }
  public app<T extends WechatMiniprogram.IAnyObject>(option: WechatMiniprogram.App.Options<T>){
    this.constructorType = 'App'
    return new ChainApp(option, this.eventBus)
  }
  public page<
    TData extends WechatMiniprogram.Page.DataOption, 
    TCustom extends WechatMiniprogram.Page.CustomOption,
  >(option: WechatMiniprogram.Page.Options<TData, TCustom, {$eventBus: EventBus<E>}>){
    this.constructorType = 'Page'
    return new ChainPage({
      ...option,
      $eventBus: this.eventBus
    }, this.eventBus)
  }
  public component<
      TData extends WechatMiniprogram.Component.DataOption,
      TProperty extends WechatMiniprogram.Component.PropertyOption,
      TMethod extends WechatMiniprogram.Component.MethodOption,
      TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
      TIsPage extends boolean = false
  >(option: WechatMiniprogram.Component.Options<
      TData,
      TProperty,
      TMethod,
      TCustomInstanceProperty,
      TIsPage
  >){
    this.constructorType = 'Component'
    return new ChainComponent(option, this.eventBus)
  }
  // public registerEvents(){
    
  // }
  public provide(){

  }
  public consume(){

  }
  public debounce(){

  }
  public throttle(){

  }
  private registerComponentTreeNode(){

  }
  private removeComponentTreeNode(){

  }
}

class ChainApp<
  T extends WechatMiniprogram.IAnyObject,
  E extends EventPoolDefine
> {
  private eventBus
  private option
  constructor(option: WechatMiniprogram.App.Options<T>, eventBus: EventBus<E>){
    this.eventBus = eventBus
    this.option = option
  }

  public subscribeEvents<K extends keyof E>(eventName: K, handler: E[K]){
    const {eventBus} = this
    const { onLaunch, onUnload } = this.option
    this.option.onLaunch = function(...onLaunchArgs){
      eventBus.addListener(eventName, handler)
      onLaunch?.call(this, ...onLaunchArgs)
    }
    return this
  }
  public create(){
    return App(this.option)
  }
}

class ChainPage<
  TData extends WechatMiniprogram.Page.DataOption, 
  TCustom extends WechatMiniprogram.Page.CustomOption,
  TExtend extends WechatMiniprogram.Page.CustomOption,
  E extends EventPoolDefine,
> {
  private eventBus
  private option
  constructor(option: WechatMiniprogram.Page.Options<TData, TCustom, TExtend>, eventBus: EventBus<E>) {
    this.eventBus = eventBus
    this.option = option
  }
  public subscribeEvents<K extends keyof E>(eventName: K, handler: (this: WechatMiniprogram.Page.Instance<TData,TCustom,TExtend>, ...args: Parameters<E[K]>) => any){
    const {eventBus} = this
    const { onLoad, onUnload } = this.option
    let unSubscribe = () => {}
    this.option.onLoad = function(...onLoadArgs){
      console.log('this', this)
      const _handler = (...args: Parameters<E[K]>) => handler.call(this as WechatMiniprogram.Page.Instance<TData,TCustom,TExtend>, ...args)
      unSubscribe = eventBus.addListener(eventName, _handler as E[K])
      onLoad?.call(this, ...onLoadArgs)
    }
    this.option.onUnload = function(...onLoadArgs) {
      unSubscribe()
      onUnload?.call(this, ...onLoadArgs)
    }
    return this
  }
  public create(){
    return Page(this.option)
  }
}

class ChainComponent<
  E extends EventPoolDefine,
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
  TIsPage extends boolean = false,
> {
  private eventBus
  private option
  constructor(option: WechatMiniprogram.Component.Options<
    TData,
    TProperty,
    TMethod,
    TCustomInstanceProperty,
    TIsPage
  >, eventBus: EventBus<E>) {
    this.eventBus = eventBus
    this.option = {
      ...option,
      $eventBus: eventBus
    }
  }
  public subscribeEvents(...args: Parameters<EventBusClass<E>['addListener']>){
    EventBus.prototype.addListener(...args)
    const {eventBus, option} = this
    const { lifetimes } = option
    if(lifetimes?.attached){
      const originalAttached = lifetimes.attached
      lifetimes.attached = function(...attachArgs){
        const ret = originalAttached(...attachArgs)
        eventBus.addListener(...args)
        return ret
      }
    }
    if (lifetimes?.detached) {
      const originalAttached = lifetimes.detached
      lifetimes.detached = function(...detachArgs){
        const ret = originalAttached(...detachArgs)
        eventBus.removeListener(...args)
        return ret
      }
    }
    return this
  }
  public create(){
    return Page(this.option)
  }
}


