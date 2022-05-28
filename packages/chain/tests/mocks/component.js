module.exports.Component = function(option){
  new _Component(option)
}

class _Component{
  constructor(option){
    const { attached, detached } = option.lifetimes || {}
    const {onLoad, onShow, onReady, onError, onHide, onUnload, lifetimes, ...rest} = option.methods
    this.isInAppClassInstance = true
    attached?.call(this)
    onLoad?.call(this, "a=1")
    onShow?.call(this)
    onReady?.call(this)
    onError?.call(this)
    Object.values(rest).forEach((method) => {
      method.call(this, 'arg')
    })
    onHide?.call(this)
    detached?.call(this)
    onUnload?.call(this)
    lifetimes?.attached?.call(this)
    lifetimes?.detached?.call(this)
  }
}
