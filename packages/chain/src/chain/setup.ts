import { Chain } from "./chain"
import { setConfig } from "../config"
import { EventBus } from "../tool-kit/event-bus"
import type { EventHandler, EventPoolDefine, Keys } from "../types"

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
}