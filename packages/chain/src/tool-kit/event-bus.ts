import { getConfig } from "../config"
import type { EventHandler, EventPoolDefine, Keys, ModuleOptions } from "../types"

type ArrayValue<T extends Record<string, V>, V> = {[P in keyof T]: T[P][]}

const WARNING_HANDLER_COUNT = 10

export class EventBus<E extends EventPoolDefine> {
  private pool
  private options
  public constructor(eventDefine: E, options: ModuleOptions = {isDev: false, debug: false}){
    const eventNames = Object.keys(eventDefine)
    this.pool = eventNames.reduce<
      ArrayValue<E, EventHandler>
    >((acc, cur) => ({...acc, [cur]: []}), {} as ArrayValue<E, EventHandler>)
    this.options = options
  }

  public clearEvent(eventName: keyof E){
    this.pool[eventName].length = 0
  }

  public addListener<K extends keyof E, H extends E[K]>(eventName: keyof E, handler:H) {
    this.pool[eventName].push(handler)
    
    const handlerCount = this.pool[eventName].length

    if(handlerCount >= WARNING_HANDLER_COUNT && this.options.isDev){
      console.warn(`mp-toolkit: 事件 ${eventName} 已经注册了 ${handlerCount} 个处理函数，请注意是否存在内存泄露`)
    }
    return () => this.removeListener(eventName, handler)
  }

  public removeListener<K extends keyof E>(eventName: K, handler: E[K]){
    const handlers = this.pool[eventName]
    const targetIndex = handlers.findIndex(h => h === handler)
    handlers.splice(targetIndex, 1)
  }

  public emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]> ){
    this.traverseListeners(eventName, function(listener){
      listener(...args)
    })
  }

  private traverseListeners<K extends keyof E>(eventName: K, visitor: (listener: E[K]) => void){
    this.pool[eventName].forEach(listener => {
      visitor(listener)
    })
  }

}

