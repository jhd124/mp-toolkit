import { EventBus } from "../tool-kit"
import { StateStore } from "../tool-kit/state-store"
import { EventPoolDefine, TStoreState } from "../types"

export type MPToolKitOptionProperties<
  E extends EventPoolDefine,
  S extends TStoreState
> = {
  $mpKit: {
    eventBus: EventBus<E>
    stateStore: StateStore<S>
  }
}