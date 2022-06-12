import { chain } from "../../setup-mp-toolkit"

chain()
  .page({
    data: {
      eventIllustration: false,
      throttleIndicator: 0,
      debounceIndicator: 0,
    },
    methods: {
      onTapReviseUserInfo(){
        wx.navigateTo({url: '/pages/user-detail/user-detail'})
      },
      onTapToggleEventIllustration(){
        this.$mpKit.eventBus.emit('event', !this.data.eventIllustration)
      }
    },
  })
  .subscribeState(function(state) {
    this.setData({
      user: state.user
    })
  })
  .subscribeEvents('event', function(b) {
    this.setData({
      eventIllustration: b
    })
  })
  .throttle({
    onTapThrottle: {
      method(){
        this.setData({
          throttleIndicator: this.data.throttleIndicator + 1
        })
      },
      time: 500
    },
  })
  .debounce({
    onTapDebounce: {
      method(){
        this.setData({
          debounceIndicator: this.data.debounceIndicator + 1
        })
      },
      time: 500,
    },
  })
  .create()
