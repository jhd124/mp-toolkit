export function debounce<T extends(...args: any[]) => any>(
    fn: T, 
    time: number, 
    options: {leading: boolean} = { leading: false }
  ) {
  let lastInvokeTime: number = 0;
  let timer: NodeJS.Timeout | null = null;
  const { leading } = options;
  return function (this: any, ...args: Parameters<T>) {
    const previousInvokeTime = lastInvokeTime;
    const currentTime = Date.now();
    lastInvokeTime = currentTime;

    if (leading) {
      if (currentTime - previousInvokeTime >= time) {
        fn.call(this, ...args);
      }
    } else {
      if (currentTime - previousInvokeTime < time) {
        if (timer !== null) {
          clearTimeout(timer);
        }
      }
      timer = setTimeout(() => {
        fn.call(this, ...args);
      }, time);
    }
  };
}
