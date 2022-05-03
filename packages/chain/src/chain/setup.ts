import { Chain } from "./chain"
import { setConfig } from "../config"
import { EventBus } from "../tool-kit/event-bus"
import type { EventPoolDefine, Keys, TStoreState } from "../types"
import { StateStore } from "../tool-kit/state-store"

type SetupOption = {
  eventDefine: EventPoolDefine,
  stateDefine?: TStoreState
}

export function setup<O extends SetupOption>(
  options: {
    eventNames: Keys<O['eventDefine']>, 
    initialState?: O['stateDefine'], 
    isDev?: boolean, 
    debug?: boolean
  }
){
  const { eventNames, initialState = {}, isDev = false, debug = false } = options
  const eventBus = new EventBus(eventNames || [])
  const stateStore = new StateStore(initialState)
  setConfig({
    isDev,
    debug,
  })
  return {
    chain: function chain(){
      const instance =  new Chain(eventBus, stateStore)
      return instance
    },
    stateStore,
    eventBus,
  }
}