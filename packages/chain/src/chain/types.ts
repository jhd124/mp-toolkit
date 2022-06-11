import { EventBus } from "../tool-kit"
import { StateStore } from "../tool-kit/state-store"
import { EventPoolDefine, StoreStateDefine } from "../types"

export type MPToolKitOptionProperties<
  E extends EventPoolDefine,
  S extends StoreStateDefine
> = {
  $mpKit: {
    eventBus: EventBus<E>
    stateStore: StateStore<S>
  }
}

export type ProcessFunction = <T extends WechatMiniprogram.Component.TrivialOption>(Options: T) => T