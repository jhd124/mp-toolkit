export type EventHandler<T = unknown> = (this: T, ...args: any[]) => any
export type EventPoolDefine = Record<string, EventHandler>
export type ModuleOptions = {isDev?: boolean, debug?: boolean}
export type StoreStateDefine = Record<string, unknown>
