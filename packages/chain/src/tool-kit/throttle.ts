export function throttle<T extends (...args: any[]) => any>(fn: T, time: number){
  let lastInvokeTime = 0
  let ret: ReturnType<T>
  return function(this: any, ...args: Parameters<T>){
    const currentTime = Date.now()
    if(currentTime - lastInvokeTime >= time){
      ret = fn.call(this, ...args)
      lastInvokeTime = currentTime
    }
    return ret
  }
}