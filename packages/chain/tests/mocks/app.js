module.exports.App = function(option){
  new _App(option)
}

class _App{
  constructor(option){
    const {onLaunch} = option
    this.isInAppClassInstance = true
    onLaunch?.call(this)
  }
}
