import type { EventPoolDefine } from '../types'
import type { EventBus } from '../tool-kit/event-bus'
import type { MPToolKitOptionProperties, ProcessFunction } from './types'
import { ChainApp } from './chain-app'
import { ChainComponent } from './chain-component'
import { StoreStateDefine } from '../types'
import { StateStore } from '../tool-kit/state-store'
export class Chain<E extends EventPoolDefine, S extends StoreStateDefine> {
  private eventBus
  private stateStore
  private componentOptionInterceptor

  constructor(eventBus: EventBus<E>, stateStore: StateStore<S>, componentOptionInterceptor?: ProcessFunction){
    this.eventBus = eventBus
    this.stateStore = stateStore
    this.componentOptionInterceptor = componentOptionInterceptor
  }

  public app<T extends WechatMiniprogram.IAnyObject>(option: WechatMiniprogram.App.Options<T, {
    $mpKit: {
      eventBus: EventBus<E>,
      stateStore: StateStore<S>,
    }
  }>){
    return new ChainApp(
      {
        ...option,
      }, 
      this.eventBus,
      this.stateStore,
    )
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
      TCustomInstanceProperty & MPToolKitOptionProperties<E, S>,
      true
  >) {
    return new ChainComponent(
      {
        ...option,
      }, 
      this.eventBus,
      this.stateStore,
      true,
      this.componentOptionInterceptor,
    )
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
      TCustomInstanceProperty & MPToolKitOptionProperties<E, S>,
      false
  >){
    return new ChainComponent(
      {
        ...option,
      }, 
      this.eventBus,
      this.stateStore,
      false,
      this.componentOptionInterceptor,
    )
  }
}
