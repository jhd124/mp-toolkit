import { chain } from "../../getChain";

chain().component({
  lifetimes: {
    attached(){
    }
  }
})
.create()