import { chain } from "../../getChain"


//    ^?

chain()
  .page({
    data: {
      s: 0
    },
    methods: {
      onLoad(){
        console.log('onLoad', this)
        this.$mpKit.stateStore.state
      }
    },
  })
  .subscribeEvents('a', function(){})
  .subscribeEvents('a' , function(n) {
    console.log('[[[[[[[this]]]]]]]', this)
    this.setData({s: n})
    // this.$mpKit.eventBus.emit('a', 1,'s')
    // this.$mpKit.stateStore
  })
  .throttle({
    throttleTap: {
      method(){
        console.log('this', this)
      },
      time: 1000
    },
  })
  .debounce({
    debounceLeadingTap: {
      method(e){
        console.log('点击了leading debounce', e)
      },
      time: 500,
      options: {
        leading: true
      }
    },
    debounceTap: {
      method(e){
        console.log('点击了debounce', e)
      },
      time: 500
    }
  })
  .subscribeState(function(state) {
    console.log('subscribeState', this, state)
  })
  .create()
