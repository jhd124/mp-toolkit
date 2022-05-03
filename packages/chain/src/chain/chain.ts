import type { EventPoolDefine } from '../types'
import type { EventBus } from '../tool-kit/event-bus'
import { ChainApp } from './chainApp'
import { ChainComponent } from './chainComponent'
import { TStoreState } from '../types'
import { StateStore } from '../tool-kit/state-store'

export class Chain<E extends EventPoolDefine> {
  private eventBus
  private stateStore

  constructor(eventBus: EventBus<E>, stateStore: StateStore){
    this.eventBus = eventBus
    this.stateStore = stateStore
  }

  public app<T extends WechatMiniprogram.IAnyObject>(option: WechatMiniprogram.App.Options<T, {
    $mpKit: {
      eventBus: EventBus<E>
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
      TCustomInstanceProperty & {
        $mpKit: {
          eventBus: EventBus<E>
        }
      },
      true
  >) {
    return new ChainComponent(
      {
        ...option,
      }, 
      this.eventBus,
      this.stateStore,
      true
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
      TCustomInstanceProperty & {
        $mpKit: {
          eventBus: EventBus<E>
        }
      },
      false
  >){
    return new ChainComponent(
      {
        ...option,
      }, 
      this.eventBus,
      this.stateStore,
      false
    )
  }
}
