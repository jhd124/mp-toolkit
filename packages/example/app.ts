import '@mp-toolkit/chain';
import { chain } from './getChain';

chain().app({
  onLaunch(){
      setTimeout(() => { 
        this
        this.$eventBus.emit('a', 250) }, 2000)
  }
}).create()