import { chain } from "../../getChain";

chain().component({
  lifetimes: {
    attached(){
      console.log("[[[[[[[[[first]]]]]]]]]")
      console.log('this.', this)
    }
  }
})
.create()