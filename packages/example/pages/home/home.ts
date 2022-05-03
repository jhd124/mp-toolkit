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
      }
    },
  })
  .subscribeEvents('a' , function(n) {
    this.setData({s: n})
    this.$mpKit.eventBus
    this.$mpKit.stateStore
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
        console.log('this', this)
        console.log('点击了debounce', e)
      },
      time: 500
    }
  })
  .subscribeState(state => {
    console.log(state)
  })
  .create()
