import { EventBus } from "../tool-kit"
import { StateStore } from "../tool-kit/state-store"
import { EventPoolDefine, TStoreState } from "../types"
import { createMissingWarning } from "./warn-create"

interface LifetimesVisitors<TThis> {
  onLaunch(this: TThis): void
}

@createMissingWarning
export class ChainApp<
  E extends EventPoolDefine,
  S extends TStoreState,
  T extends WechatMiniprogram.IAnyObject,
  TExtend extends WechatMiniprogram.IAnyObject,
  TThis extends WechatMiniprogram.App.Instance<T, TExtend>
> {
  private eventBus
  private stateStore
  private option
  constructor(
    option: WechatMiniprogram.App.Options<T, TExtend>, 
    eventBus: EventBus<E>,
    stateStore: StateStore<S>
  ){
    this.eventBus = eventBus
    this.stateStore = stateStore
    this.option = {
      ...option,
      $mpKit: {
        eventBus: eventBus,
        stateStore: stateStore
      },
    }
  }

  private lifetimesTraverse(visitors: LifetimesVisitors<TThis>){
    const { onLaunch } = this.option
    this.option.onLaunch = function(...onLaunchArgs){
      onLaunch?.call(this, ...onLaunchArgs)
      visitors.onLaunch.call(this as TThis)
    }
  }

  public subscribeEvents<K extends keyof E>(eventName: K, handler: (this: TThis, ...args: Parameters<E[K]>) => any){
    const {eventBus} = this
    this.lifetimesTraverse({
      onLaunch(){
        const _handler = (...args: Parameters<E[K]>) => handler.call(this as TThis, ...args)
        eventBus.addListener(eventName, _handler as E[K])
      }
    })
    return this
  }

  public subscribeState(handler: (state: S) => any){
    let unSubscribeHandler: () => void
    const { stateStore } = this
    this.lifetimesTraverse({
      onLaunch(){
        unSubscribeHandler = stateStore.subscribe(handler)
      },
    })
    return this
  }

  public create(){
    return App(this.option)
  }
}