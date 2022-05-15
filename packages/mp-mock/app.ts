export function App(option: WechatMiniprogram.App.Option){
  const {onLaunch} = option
  
}

class _App{
  constructor(option: WechatMiniprogram.App.Option){
    const {onLaunch} = option
    onLaunch?.call(this)
  }
}