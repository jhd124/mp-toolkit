import { StoreStateDefine } from "../types"

/**
 * init
 * setState
 * subscribe
 * 
 */
export class StateStore<State extends StoreStateDefine> {
  private listeners: ((state: State) => void)[]
  public state
  constructor(initData: State){
    if(Object.prototype.toString.call(initData) !== '[object Object]') {
      throw new Error("mp-toolkit: 全局状态store必须初始化为一个对象")
    }
    this.state = initData
    this.listeners = []
  }
  dispatch(state: Partial<State>){
    if (!state || !this.state) {
      return
    }
    const nextState = this.state
    for(const key in state){
      if(Object.prototype.hasOwnProperty.call(nextState, key)){
        nextState[key] = state[key] ?? nextState[key]
      } else {
        console.error(`mp-toolkit: state 里没有属性 ${key}`)
      }
    }
    this.state = nextState
    this.listeners.forEach((listener) => {
      listener(nextState)
    })
  }
  subscribe(listener: (state: State) => void){
    listener(this.state)
    this.listeners.push(listener)
    return () => this.unSubscribe(listener)
  }
  unSubscribe(listener: (state: State) => void){
    this.listeners = this.listeners.filter(i => i !== listener)
  }
}