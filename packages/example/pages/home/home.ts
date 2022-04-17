import { chain } from "../../getChain"

chain()
  .page({
    data: {
      s: 's'
    },
    onLoad(){
      // var a: WechatMiniprogram.Page.InstanceProperties = {}

      setTimeout(() => { this.$eventBus.emit('a', 200) }, 5000)
    }
  })
  .subscribeEvents('a' , (n) => {
    console.log(n)
  })
  .create()
// Page({
//   onLoad(){
//   }
// })