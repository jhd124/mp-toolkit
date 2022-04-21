import { chain } from "../../getChain"

chain()
  .page({
    data: {
      s: 0
    },
    onLoad(){
    }
  })
  .subscribeEvents('a' , function(n) {
    this.setData({s: n})
    this.$mpKit.eventBus
  })
  .create()
// Page({
//   onLoad(){
//   }
// })