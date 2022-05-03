import { TStoreState } from "../types"

/**
 * init
 * setState
 * subscribe
 * 
 */
export class StateStore<State extends TStoreState = {}> {
  private listeners: ((state: State) => void)[]
  public state: State
  constructor(initData: State){
    if(Object.prototype.toString.call(initData) === '[object Object]') {
      this.state = Object.freeze({...initData})
    } else {
      if(initData){
        console.error("mp-toolkit: 全局状态store必须初始化为一个对象")
      }
      this.state = Object.create({})
    }
    this.listeners = []
  }
  dispatch(state: Partial<State>){
    if (!state) {
      return
    }
    const nextState = {...this.state}
    for(const key in state){
      if(Object.prototype.hasOwnProperty.call(nextState, key)){
        if(state[key]){
          // @ts-expect-error partial key 应该在完成对象上存在
          nextState[key] = state[key]
        }
      }
    }
    this.state = Object.freeze({...nextState})
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