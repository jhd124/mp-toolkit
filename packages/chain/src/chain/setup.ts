import { Chain } from "./chain"
import { setConfig } from "../config"
import { EventBus } from "../tool-kit/event-bus"
import type { EventPoolDefine, StoreStateDefine } from "../types"
import { StateStore } from "../tool-kit/state-store"

export function setup<
  EventDefine extends EventPoolDefine = {}, 
  StateDefine extends StoreStateDefine = {}
>(
  options: {
    eventDefine?: EventDefine, 
    initialState?: StateDefine,
    isDev?: boolean, 
    debug?: boolean,
    componentOptionInterceptor?: <T = any>(options: T) => T, 
  }
){
  const { 
    eventDefine,
    initialState,
    componentOptionInterceptor,
    isDev = false,
    debug = false
  } = options
  const eventBus = new EventBus(eventDefine || {})
  const stateStore = new StateStore(initialState || {})
  setConfig({
    isDev,
    debug,
  })
  return {
    chain: function chain(){
      const instance =  new Chain(eventBus, stateStore, componentOptionInterceptor)
      return instance
    },
    stateStore,
    eventBus,
  }
}