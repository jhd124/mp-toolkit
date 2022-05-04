import { getConfig } from "../config"

const warning = `
  * mp-toolkit: 请调用create方法, 否则页面或组件不会被创建. 
  * 使用方式：
    new Chain()
      .page() // 或component() 或app() 
      ...
      .create()
`

export function createMissingWarning<T extends new (...args: any[]) => {create(...createArgs: any[]): any}>(target: T){
  return class extends target {
    constructor(...args: any[]){
      super(...args)
      const {isDev} = getConfig()
      if(isDev){
        const warningTimer = setTimeout(() => {
          console.error(warning)
        }, 1000)
        const originalCreate = this.create
        this.create = () => {
          debugger
          clearTimeout(warningTimer)
          return originalCreate.call(this)
        }
      }
    }
  }
}