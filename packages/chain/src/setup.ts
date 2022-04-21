import { Chain } from "./chain"
import { setConfig } from "./config"
import { EventBus } from "./event"
import type { EventHandler, EventPoolDefine, Keys } from "./types"

type SetupOption = {
  eventDefine: EventPoolDefine
}

export function setup<O extends SetupOption>(options: {eventNames: Keys<O['eventDefine']>, isDev?: boolean, debug?: boolean}){
  const { eventNames, isDev = false, debug = false } = options
  const eventBus = new EventBus<O['eventDefine']>(eventNames || [])
  setConfig({
    isDev,
    debug,
  })
  return {
    chain: function chain(){
      const instance =  new Chain<O['eventDefine']>(eventBus)
      return instance
    },
    eventBus,
  }
  // const {
  //   eventNames = []
  // } = options
  // if(!eventBus){
  //   type A = O["eventDefine"] extends undefined ? {} : O["eventDefine"]
  //   type B = O["eventDefine"] extends undefined ? {} : O["eventDefine"]
  //   eventBus = new EventBus<B>(eventNames)
  // }
 
  // var c = 0
  // var e: EventDefine = {onIncrease: (n: number) => {
  //   c += 0
  // }}
}