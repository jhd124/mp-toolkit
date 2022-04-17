import type { EventHandler, EventPoolDefine, Keys } from "./types"

type ArrayValue<T extends Record<string, V>, V> = {[P in keyof T]: T[P][]}

export class EventBus<E extends EventPoolDefine> {
  private pool: ArrayValue<E, EventHandler>
  public constructor(eventNames: Keys<E>){
    this.pool = eventNames.reduce<
      ArrayValue<E, EventHandler>
    >((acc, cur) => ({...acc, [cur]: []}), {} as ArrayValue<E, EventHandler>)
  }
  public clearEvent(eventName: keyof E){
    this.pool[eventName].length = 0
  }
  public addListener<K extends keyof E>(eventName: keyof E, handler: E[K]) {
    this.pool[eventName].push(handler)
    return () => this.removeListener(eventName, handler)
  }
  public removeListener<K extends keyof E>(eventName: K, handler: E[K]){
    const handlers = this.pool[eventName]
    const targetIndex = handlers.findIndex(h => h === handler)
    handlers.splice(targetIndex, 1)
  }
  public traverseListeners<K extends keyof E>(eventName: K, visitor: (listener: E[K]) => void){
    this.pool[eventName].forEach(listener => {
      visitor(listener)
    })
  }
  public emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]> ){
    this.traverseListeners(eventName, function(listener){
      listener(...args)
    })
  }
  
}

// export class EventBus<E extends EventPoolDefine> extends EventPool<E>{
//   public constructor(eventNames: Keys<E>){
//     super(eventNames)
//     console.log('this', this)
//   }
//   public emit<K extends keyof E>(eventName: K, args: Parameters<E[K]> ){
//     this.traverseListeners(eventName, function(listener){
//       listener(args)
//     })
//   }
// }

// setup<{onIncrease: (n: number) => void}>({
//   events: ['onIncrease']
// })
