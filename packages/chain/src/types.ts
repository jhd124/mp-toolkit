export type Keys<O extends Record<string, any> | undefined> = O extends undefined ? never : (keyof O)[] 
export type EventHandler<T = unknown> = (this: T, ...args: any[]) => any
export type EventPoolDefine = Record<string, EventHandler>
export type ModuleOptions = {isDev?: boolean, debug?: boolean}